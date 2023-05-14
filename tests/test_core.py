# (c) 2023, The Panodata Developers

import pytest
import requests

from node_blue.core import NodeBlue


@pytest.mark.asyncio
async def test_start_stop():
    blue = NodeBlue()

    # Start Node-RED, and terminate immediately.
    blue.start().stop()
    # blue.start().stop_after(0)

    # Wait until termination.
    await blue.forever()


@pytest.mark.asyncio
async def test_http_html_templating():
    blue = NodeBlue()

    # Start Node-RED, and terminate immediately.
    blue.start()

    # Submit HTTP POST request.
    # http http://localhost:1880/hello-form name=Hotzenplotz
    response = requests.post("http://localhost:1880/hello-form", json={"name": "Hotzenplotz"})
    assert response.text == "<html><body><h1>Hello Hotzenplotz!</h1></body></html>"

    # Wait until termination.
    blue.stop()
    await blue.forever()
