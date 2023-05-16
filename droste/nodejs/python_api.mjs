/**
 * Droste's JavaScript API for invoking Python code snippets.
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
     * TODO: It is currently a bit specific to Node-RED. How can it be generalized?
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
        return await this.py_register(name, pycode, {kwargs: ["msg", "send", "done"]})
    }

    /**
     * Invoke generated function.
     *
     * @param name {String}
     * @param options {Object}
     * @returns {Promise<*>}
     */
    async invoke(name, options) {

        const { msg, send, done } = options;

        console.log(`Invoking function: ${name}(${JSON.stringify(msg)})`)

        // Translate dictionary to munch, providing object-style dotted access to its attributes/items.
        const msg_munch = await munch.munchify(msg)

        // Resolve special function reference to call Python function with keyword arguments (`**kwargs`).
        // When you do a function call with a `$` before the parenthesis, for example `await some.pythonCall$()`,
        // the final argument is evaluated as a `kwargs` dictionary. You can supply named arguments this way.
        // https://github.com/extremeheat/JSPyBridge#from-javascript
        let fun = this[`${name}$`]

        // Invoke the user-defined function, with transformation data as keyword arguments, and return its result.
        const options_out = {msg: msg_munch, send: send, done: done}
        try {
            const result = await fun(options_out)
            const result_unmunched = await munch.unmunchify(result);
            console.debug(`Result from user-defined function: ${result_unmunched}`)
            return result_unmunched
        } catch (e) {
            const errmsg = `Invoking user-defined function failed: ${e.toString()}\n${e.stack}`
            done(errmsg)
        }
    }

}
