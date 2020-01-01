import Sandbox = require('sandbox');
import IExecutableBot from './IExecutableBot';
import SandboxExecutableBot from './SandboxExecutableBot';

export default class ExecutableBotsFactory {
    public createSandboxBot(code: string): IExecutableBot {
        return new SandboxExecutableBot(code, new Sandbox());
    }
}