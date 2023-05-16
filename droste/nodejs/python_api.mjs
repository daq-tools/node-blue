/**
 *
 * Droste's JavaScript API for invoking Python code snippets.
 *
 */
import {PyClass, python} from 'pythonia'

const nbcp = await python('droste.nodejs.python_host')
const munch = await python('munch')

export class PythonCodeBox extends PyClass {

    constructor(options) {
        super(nbcp.PythonCodeHost, [], options)
    }

    /**
     * Materialize Python code snippet as callable function.
     *
     * @param name {String}
     * @param pycode {String}
     * @returns {Promise<void>}
     */
    async register(name, pycode) {
        console.log(`Registering function: ${name}`)
        // TODO: Does Node-RED *always* use `msg` as an entrypoint argument? What else?
        //       How could this be generalized better?
        //       Can the arguments to anonymous code be introspected somehow? Like, reasoning
        //       "all symbols not available in Python's global scope must be arguments on the
        //       function call"? Is it sane?
        return await this.py_register(name, pycode, {kwargs: ["msg"]})
    }

    /**
     * Invoke generated function.
     *
     * @param name {String}
     * @param data {Any}
     * @returns {Promise<*>}
     */
    async invoke(name, data) {

        console.log(`Invoking function: ${name}(${JSON.stringify(data)})`)

        // Translate dictionary to munch, providing object-style dotted access to its attributes/items.
        let data_as_object = await munch.munchify(data)

        // Resolve special function reference to call Python function with keyword arguments (`**kwargs`).
        // When you do a function call with a `$` before the parenthesis, for example `await some.pythonCall$()`,
        // the final argument is evaluated as a `kwargs` dictionary. You can supply named arguments this way.
        // https://github.com/extremeheat/JSPyBridge#from-javascript
        let fun = this[`${name}$`]

        // Invoke the user-defined function, with transformation data as keyword arguments, and return its result.
        return await fun(data_as_object)
    }

}
