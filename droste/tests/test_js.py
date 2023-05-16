from runs import run


def test_js_basic_python_mjs(capfd):
    """
    Verify the example about MQTT message transformation and topic rewriting for converting from imperial to metric.
    """
    command = "node --loader=@node-loader/import-maps droste/examples/js-basic-python.mjs"
    run(command)

    out, err = capfd.readouterr()
    assert (
        "Result is: {'payload': {'temperature': 5.79}, 'topic': 'foo/metric'}" in out
    ), f"""

The command was:
{command}

The output was:
{out}

The error output was:
{err}
    """


def test_js_basic_python_js(capfd):
    """
    Verify the example about MQTT message transformation and topic rewriting for converting from imperial to metric.
    """
    command = "node droste/examples/js-basic-python.js"
    run(command)

    out, err = capfd.readouterr()
    assert (
        "Result is: {'payload': {'temperature': 5.79}, 'topic': 'foo/metric'}" in out
    ), f"""

The command was:
{command}

The output was:
{out}

The error output was:
{err}
    """
