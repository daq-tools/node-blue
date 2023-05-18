# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import dataclasses
import threading
import typing as t
import asyncio
from pathlib import Path

import javascript


@dataclasses.dataclass
class NodeBlueContext:
    program: t.Union[str, Path]
    retval: t.Any
    module: t.Any
    task: t.Optional[asyncio.Task]


def jsrun(__program: t.Union[str, Path], __global_variables: t.Optional[t.Dict[str, t.Any]] = None) -> NodeBlueContext:
    __bootloader__ = open(__program).read()
    module: t.Dict = {}

    __global_variables = __global_variables or {}
    for key, value in __global_variables.items():
        javascript.globalThis[key] = value

    retval = javascript.eval_js(__bootloader__)
    threading.Event().wait(0.01)
    # print("retval:", retval)

    current_task = asyncio.current_task()

    ctx = NodeBlueContext(
        program=__program,
        retval=retval,
        module=module,
        task=current_task,
    )
    return ctx
