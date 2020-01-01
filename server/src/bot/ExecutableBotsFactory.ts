import Sandbox = require('sandbox');
import IExecutableBot from './IExecutableBot';
import SendboxExecutionBot from './SendboxExecutionBot';

export default class ExecutableBotsFactory {
    public createSandboxBot(code: string): IExecutableBot {
        return new SendboxExecutionBot(code, new Sandbox());
    }
}