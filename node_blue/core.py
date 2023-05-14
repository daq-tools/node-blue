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

from node_blue.hal import jsrun, Context
from node_blue.util import run_later, wait

logger = logging.getLogger(__name__)


class NodeBlue:
    """
    Manage a Node-RED instance.
    """

    def __init__(self, flow: t.Optional[t.Union[str, Path]] = None):
        self.flow = flow
        self.context: Context
        self.red: ModuleType
        self.stopping = False

    def start(self):
        """
        Launch Node-RED instance.
        """
        logger.info("Launching Node-RED context")

        # Acquire 3rd-party libraries upfront.
        # TODO: It does not seem to work from within the Node.js environment -- why?
        javascript.require("express")
        javascript.require("http-shutdown")
        javascript.require("node-red")

        program = str(importlib.resources.files("node_blue").joinpath("minired.js"))
        logger.info(f"Loading program: {program}")

        self.context = jsrun(program)
        self.red = self.context.retval

        wait(0.75)

        # print("ctx:", self.context)
        return self

    def stop(self):
        """
        Stop Node-RED instance.

        TODO: Use `red.stop()`.

        Note:
        Node-RED's inline documentation at `red.stop()` says:
        > Once called, Node-RED should not be restarted until the Node.JS process is restarted.
        Indeed, when called, then on another call to `red.init()` Node-RED will croak `Cannot init without a stop`.
        """

        logger.info("Node-RED: Sending shutdown signal")
        self.red.shutdown()
        self.wait_stopped()
        logger.info("Node-RED: Shutdown completed")

        logger.info("Cancelling Node-RED wrapper task")
        if self.context.task is not None:
            self.stopping = True
            self.context.task.cancel()
            wait(0.15)
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
            wait(0.05)
        return self

    def wait_stopped(self):
        """
        Block until Node-RED has stopped completely.
        """
        while self.is_started():
            logger.info("Waiting for Node-RED to shut down")
            wait(0.05)
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
        logger.info(f"Node-RED nodes:\n{self.nodes_summary}")
        self.wait_started()
        await self.forever()

    async def forever(self):
        """
        Wait until termination.
        """
        if self.context.task is not None:
            try:
                await asyncio.wait([self.context.task])
            except asyncio.CancelledError:
                logger.warning("Task got cancelled")
            finally:
                self.stopping = False


async def launch_blue():
    """
    Launch a Node-BLUE instance.
    """
    # Start Node-RED, and wait until termination.
    blue = NodeBlue()
    await blue.run()


async def launch_blue_manual():
    """
    Launch a Node-BLUE instance.
    """
    blue = NodeBlue()

    # Start Node-RED.
    blue.start().wait_started()

    # Start Node-RED, and terminate shortly after.
    # blue.start().stop_after(3)
    # blue.stop_after(0)
    # blue.stop()

    # Wait until termination.
    await blue.forever()
