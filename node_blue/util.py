# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import asyncio
import functools
import json
import logging
import textwrap
import threading
import typing as t
from pathlib import Path

import click
import colorlog
import json5
import requests
import yaml
from colorlog.escape_codes import escape_codes

logger = logging.getLogger(__name__)


def setup_logging(level=logging.INFO):
    reset = escape_codes["reset"]
    log_format = f"%(asctime)-15s [%(name)-28s] %(log_color)s%(levelname)-8s:{reset} %(message)s"

    handler = colorlog.StreamHandler()
    handler.setFormatter(colorlog.ColoredFormatter(log_format))

    logging.basicConfig(format=log_format, level=level, handlers=[handler])


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


def acquire_text_resource(resource: t.Optional[t.Union[str, Path]] = None) -> t.Any:
    if resource is None:
        raise FileNotFoundError("No file, directory, or URL given")

    resource_str = str(resource)
    resource_path = Path(resource)

    logger.info(f"Loading resource from {resource}")
    if resource_str.startswith("http://") or resource_str.startswith("https://"):
        return requests.get(resource_str).json()
    else:
        if not resource_path.exists():
            raise FileNotFoundError(f"File or directory not found: {resource_path}")
        if resource_path.is_file():
            suffix = resource_path.suffix
            with open(resource) as f:
                if suffix == ".json":
                    return json.load(f)
                elif suffix == ".json5":
                    return json5.load(f)
                elif suffix in [".yaml", ".yml"]:
                    return yaml.safe_load(f)
                else:
                    raise NotImplementedError(f"Reading files with format {suffix} not supported")
        else:
            raise NotImplementedError("Processing a whole directory not implemented yet")
