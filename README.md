# Node-BLUE

_Node-RED without a mouse / Node-RED as a library / Write Node-RED flows in YAML / Now it all makes sense_


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
    blue = NodeBlue(flow="https://github.com/daq-tools/node-blue/blob/main/examples/flows/http-html-templating.json")

    # Start Node-RED instance.
    blue.start().wait_started()

    # Wait until termination.
    await blue.forever()

if __name__ == "__main__":
    asyncio.run(launch_blue())
```


## Etymology

To use the name »Node-BLUE« for this project was obvious to us.
We discovered that there has been another project called Node-BLUE,
but is has been archived, so there will not be any harm.

- https://www.npmjs.com/package/node-blue
- https://github.com/node-blue/node-blue


## Acknowledgements

This project bundles a few significant pieces of software, where countless authors
contributed to. We are only listing inventors of the major application-level
components, remember there may be several layers of operating systems beneath,
and silicon either.

- [Brendan Eich] and contributors for [JavaScript].
- [@extremeheat] and contributors for [JSPyBridge].
- [Guido van Rossum] and contributors for [Python].
- [Lars Bak] and contributors for [V8].
- [Nick O'Leary] and contributors for [Node-RED]. 
- [Ryan Dahl] and contributors for [Node.js] and [Deno].

Thank you!


[Brendan Eich]: https://en.wikipedia.org/wiki/Brendan_Eich
[Deno]: https://github.com/denoland
[@extremeheat]: https://github.com/extremeheat
[Guido van Rossum]: https://github.com/gvanrossum
[HTTPie]: https://httpie.io/
[JavaScript]: https://en.wikipedia.org/wiki/JavaScript
[JSPyBridge]: https://github.com/extremeheat/JSPyBridge
[Lars Bak]: https://en.wikipedia.org/wiki/Lars_Bak_(computer_programmer)
[Nick O'Leary]: https://github.com/knolleary
[Node.js]: https://github.com/nodejs
[Node-RED]: https://github.com/node-red/node-red
[Node-BLUE]: https://github.com/daq-tools/node-blue
[Python]: https://en.wikipedia.org/wiki/Python_(programming_language)
[Ryan Dahl]: https://github.com/ry
[V8]: https://en.wikipedia.org/wiki/V8_(JavaScript_engine)
