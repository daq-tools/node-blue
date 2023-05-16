import logging

from munch import munchify, unmunchify


logger = logging.getLogger(__name__)


def mkpyfun(code: str):
    """
    Simple Python proxy function stubber, for consumption in JavaScript.
    """
    logger.info(f"code: {code}")

    def receiver(kwargs):
        # print("args:", args)
        # print("kwargs:", kwargs)
        # logger.info("EVALUATE!")
        # locals().update(munchify(kwargs))
        ns = munchify(kwargs)
        exec(code, {}, ns)
        # return locals()
        return unmunchify(ns)

    return receiver
