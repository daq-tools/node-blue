/**
 * Node-BLUE JavaScript bootloader.
 *
 * Copyright (c) 2023, The Panodata developers and contributors.
 *
 * Distributed under the terms of the Apache-2.0 license, see LICENSE.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// TODO: Refactor this file to ES6 module?

// Import `blue.mjs`. `BLUE_MODULE_FILE` will be obtained from Python's `NodeBlue`.
const { NodeBlueApplication, red } = await import(BLUE_MODULE_FILE)

// Launch Node-BLUE.
const blue = new NodeBlueApplication(BLUE_SETTINGS)
await blue.setup()
await blue.start()

// Global references to Node-RED and Node-BLUE.
// FIXME: Do not use global variables.
global["RED"] = red
global["BLUE"] = blue
