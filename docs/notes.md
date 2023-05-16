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
- https://stevesnoderedguide.com/download/node-red-data-and-topic-logger
- https://www.tutorialspoint.com/best-practices-to-handle-errors-in-node-red
- https://discourse.nodered.org/t/python-in-node-red/29380
- https://flows.nodered.org/flow/1669ee522244171b020ae3f6dba5f7c6
- https://flows.nodered.org/node/node-red-contrib-xstate-machine
- https://github.com/naimo84/awesome-nodered
- https://github.com/Steveorevo/node-red-contrib-actionflows
- https://github.com/Anamico/node-red-contrib-alarm
- https://flows.nodered.org/node/node-red-contrib-queue-gate

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

### JavaScript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
- https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export

### Snippets
```python
# javascript.eval_js(f"module.paths += ['{jsroot}']")
# javascript.eval_js("console.log('mp:', module.paths)")

# program = f"require('{program}')"
# self.context = jsrun(program)
# self.context = jsrequire(program)
```

### Modbus
- https://stevesnoderedguide.com/node-red-modbus
- https://stevesnoderedguide.com/node-red-modbus-dashboards

### S7
- https://discourse.nodered.org/t/siemens-iot-2000-node-red-simatic-iot2000-node/68550
- https://support.industry.siemens.com/forum/de/en/posts/specific-nodes-for-iot2000/176929/?page=0&pageSize=10
- https://www.automation.siemens.com/sce-static/learning-training-documents/tia-portal/advanced-communication/sce-094-100-node-red-iot2000-de.pdf
- https://flows.nodered.org/node/node-red-contrib-s7
- https://flowforge.com/blog/2023/04/hannover-messe/
- https://boards.greenhouse.io/flowforge/jobs/4798023004

### Hosting
- https://fred.sensetecnic.com/
- https://flowforge.com/
