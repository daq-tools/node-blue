# Node-BLUE: Assorted bugs

### Timing!

When configured with `logging.console.level = off`, it leads to race conditions,
because there is lower overhead.

Node-BLUE needs to use events instead of **waiting**!

```
13:30:41        [node_blue.core          ] INFO   : Launching Node-RED context
[JSE] /Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/lib/editor/comms.js:230
[JSE]                     wsServer.handleUpgrade(request, socket, head, function done(ws) {
[JSE]                              ^
[JSE] TypeError: Cannot read properties of null (reading 'handleUpgrade')
[JSE]     at Server.upgrade (/Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/lib/editor/comms.js:230:30)
[JSE]     at Server.emit (node:events:524:35)
[JSE]     at onParserExecuteCommon (node:_http_server:899:14)
[JSE]     at onParserExecute (node:_http_server:793:3)
[JSE] Node.js v19.8.1
[JSE] Exception ignored in: <function Proxy.__del__ at 0x1017b1120>

** The Node process has crashed. Please restart the runtime to use JS APIs. **

FAILED
```

```
[JSE] /Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/node_modules/ws/lib/websocket-server.js:294
[JSE]       throw new Error(
[JSE]       ^
[JSE] Error: server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration
[JSE]     at WebSocketServer.completeUpgrade (/Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/node_modules/ws/lib/websocket-server.js:294:13)
[JSE]     at WebSocketServer.handleUpgrade (/Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/node_modules/ws/lib/websocket-server.js:271:10)
[JSE]     at Server.upgrade (/Users/amo/dev/daq-tools/sources/node-blue/node_modules/@node-red/editor-api/lib/editor/comms.js:230:30)
[JSE]     at Server.emit (node:events:524:35)
[JSE]     at onParserExecuteCommon (node:_http_server:899:14)
[JSE]     at onParserExecute (node:_http_server:793:3)
[JSE] Node.js v19.8.1
```
