# (c) 2023, The Panodata Developers
import pytest

from node_blue.hal import jsrun


@pytest.mark.asyncio
async def test_jsrun(tmp_path):
    jsfile = tmp_path / "test.js"
    jsfile.write_text("module.exports = { forty_two: function() { return 42; } };")
    ctx = jsrun(jsfile)
    jsfunc = ctx.module["exports"]["forty_two"]
    assert jsfunc() == 42
