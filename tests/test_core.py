# Copyright (c) 2023, The Panodata developers and contributors.
# Distributed under the terms of the Apache-2.0 license, see LICENSE.
import json
import os
import sys

import pytest
import requests
from pytest_mqtt import MqttMessage

from node_blue.core import NodeBlue, FlowManager
from node_blue.util import wait


@pytest.mark.repeat(2)
@pytest.mark.asyncio
async def test_start_stop():
    # Start Node-RED, and terminate immediately.
    blue = NodeBlue()
    blue.start().wait_started().stop()
    # blue.start().wait_started().stop_after(0)

    # Wait until termination.
    await blue.forever()


@pytest.mark.asyncio
async def test_http_html_templating():
    # Configure Node-BLUE flow manager.
    fm = FlowManager()
    fm.load_flow("examples/flows/http-html-templating.json")

    # Start Node-RED, and terminate immediately.
    blue = NodeBlue(fm=fm)
    blue.start().wait_started()
    wait(0.05)

    # Submit HTTP POST request, and verify response body.
    # http http://localhost:1880/hello-form name=Hotzenplotz
    response = requests.post("http://localhost:1880/hello-form", json={"name": "Hotzenplotz"})
    assert response.text == "<html><body><h1>Hello Hotzenplotz!</h1></body></html>"

    # Wait until termination.
    blue.stop()
    await blue.forever()


@pytest.mark.skipif(
    sys.platform in ["darwin", "win32"] and "GITHUB_ACTION" in os.environ,
    reason="By default, there is no Docker installation on GHA for macOS and Windows",
)
@pytest.mark.asyncio
@pytest.mark.capmqtt_decode_utf8
async def test_mqtt_unit_rewriting_json5(mosquitto, capmqtt):
    # Configure Node-BLUE flow manager.
    fm = FlowManager()
    fm.load_flow("examples/flows/mqtt-unit-rewriting.json5")

    # Start Node-RED, and terminate immediately.
    blue = NodeBlue(fm=fm)
    blue.start().wait_started()
    wait(0.05)

    # Publish MQTT message, and verify response message.
    capmqtt.publish("testdrive/imperial", json.dumps({"temperature": 42.42}))
    wait(0.05)

    assert capmqtt.messages == [
        MqttMessage(topic="testdrive/imperial", payload='{"temperature": 42.42}', userdata=None),
        MqttMessage(topic="testdrive/metric", payload='{"temperature":5.79}', userdata=None),
    ]

    # Wait until termination.
    blue.stop()
    await blue.forever()


@pytest.mark.skipif(
    sys.platform in ["darwin", "win32"] and "GITHUB_ACTION" in os.environ,
    reason="By default, there is no Docker installation on GHA for macOS and Windows",
)
@pytest.mark.asyncio
@pytest.mark.capmqtt_decode_utf8
async def test_mqtt_unit_rewriting_yaml(mosquitto, capmqtt):
    # Configure Node-BLUE flow manager.
    fm = FlowManager()
    fm.load_flow("examples/flows/mqtt-unit-rewriting.yaml")

    # Start Node-RED, and terminate immediately.
    blue = NodeBlue(fm=fm)
    blue.start().wait_started()
    wait(0.05)

    # Publish MQTT message, and verify response message.
    capmqtt.publish("testdrive/imperial", json.dumps({"temperature": 42.42}))
    wait(0.05)

    assert capmqtt.messages == [
        MqttMessage(topic="testdrive/imperial", payload='{"temperature": 42.42}', userdata=None),
        MqttMessage(topic="testdrive/metric", payload='{"temperature":5.79}', userdata=None),
    ]

    # Wait until termination.
    blue.stop()
    await blue.forever()
