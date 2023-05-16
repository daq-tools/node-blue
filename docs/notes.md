# Node-BLUE miscellaneous notes

## Inquire available Node-RED pipeline elements
```shell
cat var/.config.nodes.json
ag registerType .venv/lib/python3.11/site-packages/javascript/js/node_modules/\@node-red/nodes/core/
```

## Link collection
- https://web.archive.org/web/20210515013546/https://eightbar.eu-gb.mybluemix.net/2014/01/19/node-red-flows-that-make-flows/
- https://web.archive.org/web/20210515030507/https://eightbar.eu-gb.mybluemix.net/tag/mqtt/
- https://web.archive.org/web/20210514041559/https://eightbar.eu-gb.mybluemix.net/tag/node-red/
- https://developer.ibm.com/patterns/develop-a-machine-learning-iot-app-with-node-red-and-tensorflowjs/
- https://github.com/IBM/node-red-tensorflowjs/blob/master/README.md
- https://flows.nodered.org/node/node-red-contrib-async
- https://www.npmjs.com/package/pubsub-js

### CrateDB
- https://community.crate.io/t/ingesting-mqtt-messages-into-cratedb-using-node-red/803
- https://community.crate.io/t/automating-recurrent-cratedb-queries/788
- https://flows.nodered.org/node/node-red-contrib-crate
- https://www.npmjs.com/package/node-red-contrib-cratedb
- https://n8n.io/integrations/cratedb/and/redis/

### SQL databases
- http://stevesnoderedguide.com/storing-iot-data-sql-database

### IBM and Node-RED
- https://developer.ibm.com/blogs/introducing-node-red-version-1-0/
- https://developer.ibm.com/blogs/top-5-reasons-to-use-node-red-right-now/
- https://developer.ibm.com/tutorials/i-running-node-red/
- https://developer.ibm.com/articles/implementing-etl-flows-with-node-red/
- https://github.com/barshociaj/node-red-contrib-js-storage

- https://www.blazemeter.com/blog/ibm-node-red-flows-iot-device-testing
- https://developer.ibm.com/articles/rust-for-nodejs-developers/

- https://flowforge.com/blog/2023/03/ibmcloud-starter-removed/
- https://www.ibm.com/cloud/blog/announcements/deprecation-of-ibm-cloud-starter-kits



```python
# javascript.eval_js(f"module.paths += ['{jsroot}']")
# javascript.eval_js("console.log('mp:', module.paths)")

# program = f"require('{program}')"
# self.context = jsrun(program)
# self.context = jsrequire(program)
```
