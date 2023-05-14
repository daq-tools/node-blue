# Node-BLUE

_Node-RED without a mouse / Node-RED as a library / Write Node-RED flows in YAML / 
Efficient test harnesses for Node-RED / Headless Node-RED / Improved development
cycle times / Now it all makes sense_


## About

The idea is to embed [Node-RED] into Python programs, in order to leverage it
for a number of use cases, like system automation, software testing, parallel
execution, etc.


## Synopsis

### Command-line use.
Install [Node-BLUE] and [HTTPie], and their prerequisites.
```shell
pip install httpie https://github.com/daq-tools/node-blue
node-blue setup
```

Start Node-BLUE with a Node-RED flow defining an HTTP/HTML endpoint/responder.
```shell
node-blue launch --flow=examples/flows/http-html-templating.json
node-blue launch --flow=https://github.com/daq-tools/node-blue/raw/main/examples/flows/http-html-templating.json
```

Run an example HTTP request.
```shell
http http://localhost:1880/hello-form name=Hotzenplotz
```

### Library use.
```python
import asyncio
from node_blue.core import NodeBlue

async def launch_blue():
    """
    Launch a Node-BLUE instance.
    """
    
    # Configure Node-BLUE instance with Node-RED flow.
    blue = NodeBlue(flow="https://github.com/daq-tools/node-blue/raw/main/examples/flows/http-html-templating.json")

    # Start Node-RED instance.
    blue.start().wait_started()

    # Wait until termination.
    await blue.forever()

if __name__ == "__main__":
    asyncio.run(launch_blue())
```


## Examples

### MQTT

Start Node-BLUE with a Node-RED flow defining an MQTT topic rewrite and message transformation
step. Note that this example uses the [JSON5] format, which has a few advantages over regular
JSON, like inline comments, and multi-line strings.
```shell
wget https://github.com/daq-tools/node-blue/raw/main/examples/flows/mqtt-unit-rewriting.json5
node-blue launch --flow=mqtt-unit-rewriting.json5
```

Subscribe to the broker to observe the outcome.
```shell
mosquitto_sub -t 'testdrive/#' -v
```

Run an example MQTT publish.
```shell
echo '{"temperature": 42.42}' | mosquitto_pub -t 'testdrive/imperial' -l
```

:::{tip}
Alternatively, you can also use the [YAML] format for writing flow recipes. The authors
believe it offers the best conciseness and convenience, and is also being used by the
[node-red-contrib-flow-manager] and [node-red-contrib-yaml-storage] plugins.
```shell
node-blue launch --flow=https://github.com/daq-tools/node-blue/raw/main/examples/flows/mqtt-unit-rewriting.yaml
```
:::


## Etymology

To use the name »Node-BLUE« for this project was obvious. However, we discovered
that there has been another project called Node-BLUE, referenced below. On the
other hand, because it has been archived two years ago already, we think there
will not be much harm to reuse that name now.

- https://www.npmjs.com/package/node-blue
- https://github.com/node-blue/node-blue


## Acknowledgements

This project bundles a few significant pieces of software and technologies,
which a few bright minds invented the other day, and countless authors
contributed to. We are only listing inventors of the major application-level
components, remember there may be several layers of operating systems beneath,
and silicon either.

- [Andy Stanford-Clark], [Arlen Nipper], and co-authors for [MQTT].
- [Brendan Eich] and contributors for [JavaScript].
- [@extremeheat] and contributors for [JSPyBridge].
- [Guido van Rossum] and contributors for [Python].
- [Lars Bak] and contributors for [V8].
- [Nick O'Leary] and contributors for [Node-RED]. 
- [Roger Light]  and contributors for [Mosquitto].
- [Ryan Dahl] and contributors for [Node.js] and [Deno].

Thank you!


[Andy Stanford-Clark]: https://stanford-clark.com/
[Arlen Nipper]: https://github.com/anipper
[Brendan Eich]: https://en.wikipedia.org/wiki/Brendan_Eich
[Deno]: https://github.com/denoland
[@extremeheat]: https://github.com/extremeheat
[Guido van Rossum]: https://github.com/gvanrossum
[HTTPie]: https://httpie.io/
[JavaScript]: https://en.wikipedia.org/wiki/JavaScript
[JSON5]: https://json5.org/
[JSPyBridge]: https://github.com/extremeheat/JSPyBridge
[Lars Bak]: https://en.wikipedia.org/wiki/Lars_Bak_(computer_programmer)
[Mosquitto]: https://mosquitto.org/
[MQTT]: https://en.wikipedia.org/wiki/MQTT
[Nick O'Leary]: https://github.com/knolleary
[Node.js]: https://github.com/nodejs
[Node-BLUE]: https://github.com/daq-tools/node-blue
[Node-RED]: https://github.com/node-red/node-red
[node-red-contrib-flow-manager]: https://flows.nodered.org/node/node-red-contrib-flow-manager
[node-red-contrib-yaml-storage]: https://flows.nodered.org/node/node-red-contrib-yaml-storage
[Python]: https://en.wikipedia.org/wiki/Python_(programming_language)
[Roger Light]: https://github.com/ralight
[Ryan Dahl]: https://github.com/ry
[V8]: https://en.wikipedia.org/wiki/V8_(JavaScript_engine)
[YAML]: https://en.wikipedia.org/wiki/YAML
