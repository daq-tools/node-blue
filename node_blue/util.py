# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import asyncio
import functools
import logging
import sys
import textwrap
import threading
import typing as t

import click


def setup_logging(level=logging.INFO):
    log_format = "%(asctime)-15s [%(name)-20s] %(levelname)-7s: %(message)s"
    logging.basicConfig(format=log_format, stream=sys.stderr, level=level)


async def run_later(fun: t.Callable, seconds: float):
    await asyncio.sleep(seconds)
    fun()


def wait(seconds: float):
    threading.Event().wait(seconds)


def boot_click(ctx: click.Context, verbose: bool = False, debug: bool = False):
    """
    Bootstrap the CLI application.
    """

    # Adjust log level according to `verbose` / `debug` flags.
    log_level = logging.WARNING
    if verbose:
        log_level = logging.INFO
    if debug:
        log_level = logging.DEBUG

    # Setup logging, according to `verbose` / `debug` flags.
    setup_logging(level=log_level)


def docstring_format_verbatim(text: t.Optional[str]) -> str:
    """
    Format docstring to be displayed verbatim as a help text by Click.

    - https://click.palletsprojects.com/en/8.1.x/documentation/#preventing-rewrapping
    - https://github.com/pallets/click/issues/56
    """
    text = text or ""
    text = textwrap.dedent(text)
    lines = [line if line.strip() else "\b" for line in text.splitlines()]
    return "\n".join(lines)


def make_sync(func):
    """
    Click entrypoint decorator for wrapping asynchronous functions.

    https://github.com/pallets/click/issues/2033
    """

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return asyncio.run(func(*args, **kwargs))

    return wrapper
