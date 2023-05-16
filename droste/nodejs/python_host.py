"""
Droste's Python backend for invoking Python code snippets.
"""
import logging
import typing as t
import textwrap

from node_blue.util import setup_logging

logger = logging.getLogger(__name__)


class PythonCodeHost:
    """
    Manage compiled Python code for 3rd-party callers.
    """

    def __init__(self, verbose=False, pretty=False):
        self.verbose = verbose
        self.pretty = pretty
        self.registered_symbols = {}

        # TODO: Always?
        setup_logging()

    def register_symbol(self, name: str):
        """
        Just a little helper to avoid function name collisions.
        TODO: Droste should probably generate function names automatically.
        """
        if name in self.registered_symbols:
            raise KeyError(f"Symbol name already registered: {name}")
        self.registered_symbols[name] = True

    def py_register(self, name: str, code: str, options: t.Dict[str, t.Any] = None):
        """
        Obtain Python code without a function signature, i.e. the function body only.
        Spice it up by adding a signature, compile it, and store a reference for later
        consumption / invocation.
        """

        kwarg_names = options.get("kwargs")

        # Avoid registering the same function twice.
        self.register_symbol(name)

        # Build function code from snippet, and report about it.
        signature = f"{name}({', '.join(kwarg_names)})"
        header = f"def {signature}:"
        body = textwrap.indent(code, prefix="  ")
        func = f"{header}\n{body}".strip()
        if self.verbose:
            if self.pretty:
                import pygments
                from pygments.formatters.terminal import TerminalFormatter
                from pygments.lexers.python import PythonLexer

                func_pretty = pygments.highlight(func, PythonLexer(), TerminalFormatter(bg="dark"))
            else:
                func_pretty = func
            logger.info(f"Generated function:\n{func_pretty}")

        # Compile function from text by evaluating the code.
        # https://docs.python.org/3/library/functions.html#exec
        namespace = {}
        exec(func, namespace, namespace)
        func = namespace[name]

        # Currently, we need to do it this way, and establish a stub/proxy instance, because we did
        # not find another way how to invoke a "pure" function kwargs-style otherwise. To make
        # `.funcname$()` work, we currently need this as a wrapper object.
        setattr(self, name, func)
        return self
