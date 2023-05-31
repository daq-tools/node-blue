# MQTT to CrateDB example


## About

The `mqtt-to-cratedb.yaml` file is a Node-RED flow definition, written in YAML format.
It can be launched using an alternative Node-RED launcher called Node-BLUE.

This walkthrough exercises a classic ETL workflow for converging telemetry data from
MQTT into CrateDB, in order to give you an idea how this works.

Feedback is very much appreciated.

:::{seealso}
The example has been derived from the original [Ingesting MQTT messages into CrateDB
using Node-RED].
:::


## Setup

Run CrateDB.
```shell
docker run --rm -it --publish=4200:4200 --publish=5432:5432 --env=CRATE_HEAP_SIZE=4g crate:latest
```

Run Mosquitto.
```shell
docker run --name=mosquitto -it --rm --publish=1883:1883 eclipse-mosquitto:2.0 mosquitto -c /mosquitto-no-auth.conf
```

Provision database table.
```shell
docker run --rm -i --network=host crate crash <<SQL
  CREATE TABLE nodered_target (
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    payload OBJECT(DYNAMIC)
  );
SQL
```


## Usage

Launch flow from filesystem.
```shell
node-blue launch --flow=examples/flows/mqtt-to-cratedb.yaml
```

Alternatively, launch flow from URL.
```shell
node-blue launch --flow=https://github.com/daq-tools/node-blue/raw/main/examples/flows/mqtt-to-cratedb.yaml
```

Subscribe to MQTT topic.
```shell
mosquitto_sub -t 'testdrive/data' -v
```

Publish JSON telemetry message to MQTT topic.
```shell
echo '{"temperature": 42.42}' | mosquitto_pub -t 'testdrive/data' -l
```

Query database.
```shell
docker run --rm -i --network=host crate crash <<SQL
  REFRESH TABLE nodered_target;
  SELECT * FROM nodered_target;
SQL
```


[Ingesting MQTT messages into CrateDB using Node-RED]: https://community.crate.io/t/ingesting-mqtt-messages-into-cratedb-using-node-red/803
