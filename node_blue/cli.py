# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import logging
import typing as t
from pathlib import Path

import click

from node_blue.core import launch_blue, NodeBlue
from node_blue.util import boot_click, docstring_format_verbatim, make_sync

logger = logging.getLogger(__name__)


def help_launch():
    """
    Run Node-RED instance, with flow file.

    Synopsis
    ========

    node-blue launch \\
        --flow=https://github.com/daq-tools/node-blue/raw/main/examples/flows/http-html-templating.json

    """  # noqa: E501


def help_setup():
    """
    Set up Node-BLUE.

    node-blue setup
    """  # noqa: E501


@click.group()
@click.version_option(package_name="node-blue")
@click.option("--verbose", is_flag=True, required=False, help="Turn on logging")
@click.option("--debug", is_flag=True, required=False, help="Turn on logging with debug level")
@click.pass_context
def cli(ctx: click.Context, verbose: bool, debug: bool):
    verbose = True
    return boot_click(ctx, verbose, debug)


@cli.command("info", help="Report about platform information")
def info():
    # AboutReport.platform()
    pass


@cli.command(
    "setup",
    help=docstring_format_verbatim(help_setup.__doc__),
    context_settings={"max_content_width": 120},
)
@click.argument("command", nargs=-1)
@click.pass_context
def setup(ctx: click.Context, command: t.Tuple[str]):
    logger.info("Setup")
    NodeBlue().setup()


@cli.command(
    "launch",
    help=docstring_format_verbatim(help_launch.__doc__),
    context_settings={"max_content_width": 120},
)
@click.option("--flow", type=str, required=False)
@click.pass_context
@make_sync
async def launch(ctx: click.Context, flow: t.Union[str, Path]):
    logger.info(f"Launching flow: {flow}")
    await launch_blue(flow=flow)
