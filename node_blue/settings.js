// Settings file for Node-RED.
// Blueprint: https://github.com/node-red/node-red/blob/master/packages/node_modules/node-red/settings.js
module.exports = {

    // HTTP API is mountpoint.
    httpNodeRoot: "/",

    // Admin UI / Flow editor mountpoint.
    httpAdminRoot: "/admin",

    // Flow file to load.
    // It is `null`, because flows will be provided by Python.
    flowFile: null,

    // Filesystem location for instance metadata.
    userDir: "./var",

    // Configure editor theme and categories.
    // TODO: Currently, Node-RED crashes when `@node-red-contrib-themes/theme-collection` is installed.
    editorTheme: {

        // Choose a theme from the collection.
        // https://github.com/node-red-contrib-themes/theme-collection
        theme: "dracula",

        // Disable the "Welcome to Node-RED" tour displayed on first visit to Node-RED's Admin UI.
        tours: false,
    },
    //paletteCategories: "",

    // Your flow credentials file is encrypted using a system-generated key.
    // You should set your own key using the 'credentialSecret' option in
    // your settings file.
    // TODO: Improve and document.
    credentialSecret: "shandafonphiteccuwykteid",

    // Configure the logger.
    // https://nodered.org/docs/user-guide/runtime/logging
    logging: {
        // Console logging
        console: {
            level: "info",
            // When set to true, flow execution and memory usage information are logged.
            metrics: false,
            // When set to true, the Admin HTTP API access events are logged.
            audit: false
        }
    },

}
