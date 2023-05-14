# (c) 2023, The Panodata Developers
import asyncio
import logging
import sys
import threading
import typing as t


def setup_logging(level=logging.INFO):
    log_format = "%(asctime)-15s [%(name)-20s] %(levelname)-7s: %(message)s"
    logging.basicConfig(format=log_format, stream=sys.stderr, level=level)


async def run_later(fun: t.Callable, seconds: float):
    await asyncio.sleep(seconds)
    fun()


def wait(seconds: float):
    threading.Event().wait(seconds)
