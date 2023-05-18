# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import asyncio
import importlib.resources
import logging
from pathlib import Path
from types import ModuleType

import funcy
import javascript
import javascript.connection
import typing as t

import tabulate

from node_blue.hal import NodeBlueContext, jsrun
from node_blue.util import run_later, wait, acquire_text_resource

logger = logging.getLogger(__name__)


class FlowManager:
    """
    Node-BLUE flow manager and provider for Node-RED.
    """

    def __init__(self):
        self.flows: t.List = []

    def get_flows(self) -> t.List:
        """
        Get current state of flows. This method is used from Node-RED by invoking `blue.get_flows()`.
        """
        return self.flows

    def set_flows(self, flows: t.List):
        """
        Directly supply flows to Node-RED.
        """
        self.flows = flows

    def load_flow(self, flow: t.Optional[t.Union[str, Path]] = None):
        """
        Load Node-RED flow file from any resource.

        TODO: Apply sanity checks on return value of `acquire_text_resource`.
        """
        self.flows = acquire_text_resource(flow)


class NodeBlue:
    """
    Manage a Node-RED instance.
    """

    def __init__(self, fm: FlowManager = None, listen: str = "127.0.0.1:1880"):
        self.fm: FlowManager = fm or FlowManager()
        self.listen = listen
        self.context: NodeBlueContext
        self.red: ModuleType
        self.blue: ModuleType
        self.stopping = False
        self.configure()

    def setup(self):
        """
        Acquire 3rd-party NPM libraries upfront.

        TODO: It does not seem to work from within the Node.js environment -- why?
        TODO: The Python program has to be restarted -- why?
        TODO: Pin versions of packages.
        TODO: Refactor into `package.json`?
        TODO: Why does colored output using `chalk` not work?
        """

        # javascript.require("chalk")
        javascript.require("http-shutdown", "^1.2")
        javascript.require("node-red", "^3.0.2")
        javascript.require("pythonia", "^1.0.1")
        javascript.require("@node-loader/import-maps", "^1.1.0")

        # When this is installed, subtle exceptions will happen, and
        # the test harness stops working, so something is fishy.
        # javascript.require("@node-red-contrib-themes/theme-collection")

    def configure(self):
        """
        Connect Node-BLUE with Node-RED, by adding a reference to ourselves into the
        global JavaScript scope.
        """
        logger.info("Connecting Node-BLUE with Node-RED")

        # FIXME: Do not use global variables.
        javascript.globalThis["blue_context"] = self

    def get_flows(self):
        """
        Node-BLUE flow provider for Node-RED.
        """
        if self.fm is None:
            logger.error("Node-BLUE flow provider not enabled")
        else:
            flows = self.fm.get_flows()
            if flows is None:
                logger.warning("No flows provided by Node-BLUE")
            else:
                return flows
        return []

    def start(self):
        """
        Launch Node-RED instance.
        """
        logger.info("Launching Node-RED context")

        # Acquire paths to JavaScript code.
        node_blue_resources = importlib.resources.files("node_blue")
        bootloader = str(node_blue_resources.joinpath("boot.js"))
        program = str(node_blue_resources.joinpath("blue.mjs"))

        # Invoke bootloader.
        # TODO: Investigate different kinds of bootstrapping.
        #       Maybe also use `PyClass`?
        self.context = jsrun(bootloader, {"BLUE_MODULE_FILE": program, "BLUE_SETTINGS": {"listen": self.listen}})

        # TODO: Improve. Use events.
        wait(0.05)

        # FIXME: Do not use global variables.
        self.red = javascript.globalThis["RED"]
        self.blue = javascript.globalThis["BLUE"]

        return self

    def stop(self):
        """
        Stop Node-RED instance.

        Note: Node-RED's inline documentation at `red.stop()` says:

        > Once called, Node-RED should not be restarted until the Node.JS
        > process is restarted.

        Indeed, when called, then on another call to `red.init()` Node-RED will
        croak like `Cannot init without a stop`.

        However, by using the `http-shutdown` package, it seems to work well to
        set up and teardown Node-RED multiple times without needing to restart
        the interpreter, Python and Node.JS.
        """

        logger.info("Node-RED: Sending shutdown signal")
        # TODO: Do something more meaningful with response from shutdown task.
        shutdown_status = self.blue.stop()  # noqa: F841
        self.wait_stopped()
        logger.info("Node-RED: Shutdown completed")

        logger.info("Cancelling Node-RED wrapper task")
        if self.context.task is not None:
            self.stopping = True
            asyncio.create_task(run_later(self.context.task.cancel, 0.05))
        return self

    def is_started(self) -> bool:
        """
        Return whether Node-RED is running.
        """
        return self.red.runtime.isStarted()

    def version(self) -> str:
        """
        Return Node-RED version number.
        """
        return self.red.version()

    @property
    def settings(self) -> t.Any:
        return self.red.settings

    @property
    def nodes(self) -> t.Any:
        return self.red.nodes

    @property
    def nodes_summary(self) -> str:
        """
        Generate a tabular overview about all pipeline elements (nodes).
        """
        items_out = []
        limited_keys = ["id", "types"]
        for node in self.nodes.getNodeList():
            item = dict(funcy.project(node, limited_keys))
            items_out.append(item)
        return tabulate.tabulate(items_out, headers="keys")

    def wait_started(self):
        """
        Block until Node-RED has started completely.
        """
        while not self.is_started():
            logger.info("Waiting for Node-RED to boot")
            wait(0.15)
        wait(0.01)
        logger.info("Node-RED started successfully")
        return self

    def wait_stopped(self):
        """
        Block until Node-RED has stopped completely.
        """
        while self.is_started():
            logger.info("Waiting for Node-RED to shut down")
            wait(0.15)
        wait(0.01)
        return self

    def stop_after(self, seconds: float):
        """
        Schedule a kill task to trigger after X seconds.
        """
        logger.info(f"Starting `stop_after` task, will trigger in {seconds} seconds")
        asyncio.create_task(run_later(self.stop, seconds))
        return self

    async def run(self):
        """
        Start Node-RED, and wait until termination.
        """
        self.start()
        logger.info(f"Node-RED version: {self.version()}")
        # logger.info(f"Node-RED settings: {blue.settings}")
        # logger.info(f"Node-RED nodes:\n{self.nodes_summary}")
        self.wait_started()
        await self.forever()

    async def forever(self):
        """
        Wait until termination.

        TODO: Improve!
        """
        if self.context and self.context.task is not None:
            try:
                await asyncio.wait([self.context.task])
            except asyncio.CancelledError:
                logger.warning("Task got cancelled")
            finally:
                self.stopping = False


async def launch_blue(listen: str, flow: t.Union[str, Path]):
    """
    Launch a Node-BLUE instance.
    """

    # Configure Node-BLUE flow manager.
    fm = FlowManager()

    # TODO: Load multiple flows.
    fm.load_flow(flow)

    # Start Node-RED, and wait until termination.
    blue = NodeBlue(fm=fm, listen=listen)
    await blue.run()


async def launch_blue_manual(listen: str, flow: t.Union[str, Path]):
    """
    Launch a Node-BLUE instance.
    """

    # Configure Node-BLUE flow manager.
    fm = FlowManager()
    fm.load_flow(flow)

    # Start Node-RED.
    blue = NodeBlue(listen=listen)
    blue.start().wait_started()

    # Optionally, terminate shortly after.
    # blue.start().stop_after(3)
    # blue.stop_after(0)
    # blue.stop()

    # Wait until termination.
    await blue.forever()
