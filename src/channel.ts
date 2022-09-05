import * as vscode from 'vscode';
import { getConfig } from './util';

class Channel {
    private outputChannel: vscode.OutputChannel;
    private alwaysShowOutput: boolean;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Inno Setup');
        this.alwaysShowOutput = getConfig('alwaysShowOutput');
    }

    public clear(): void {
        this.outputChannel.clear();

        if (this.alwaysShowOutput) {
            this.show();
        }
    }

    dispose(): void {
        this.outputChannel.dispose();
    }

    async append(input: string): Promise<void> {
        this.outputChannel.append(input);

        if (this.alwaysShowOutput) {
            this.show();
        }
    }

    async appendLine(input: string): Promise<void> {
        this.outputChannel.appendLine(input);

        if (this.alwaysShowOutput) {
            this.show();
        }
    }

    hide(): void {
        this.outputChannel.hide();
    }

    show(preserveFocus = true): void {
        this.outputChannel.show(preserveFocus);
    }
}

export const outputChannel = new Channel();
