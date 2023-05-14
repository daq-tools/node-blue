# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import dataclasses
import typing as t
import asyncio
from pathlib import Path

import javascript


@dataclasses.dataclass
class Context:
    program: t.Union[str, Path]
    retval: t.Any
    module: t.Any
    task: t.Optional[asyncio.Task]


def jsrun(program: t.Union[str, Path]) -> Context:
    bootloader = open(program).read()
    module: t.Dict = {}
    retval = javascript.eval_js(bootloader)
    # print("retval:", retval)

    current_task = asyncio.current_task()

    ctx = Context(
        program=program,
        retval=retval,
        module=module,
        task=current_task,
    )
    return ctx
