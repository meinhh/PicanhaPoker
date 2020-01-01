import Sandbox = require('sandbox');

export default class BotRunner {
    public static run(): void {
        const sandbox = new Sandbox();
        const code = "(function(name) { console.log('11'); return 'Hi there, ' + name + '!'; })";
        sandbox.run( code + "('Fabio')", function( output ) {
            console.log( "Example 2: " + output.result + "\n" )
        });
    }
}