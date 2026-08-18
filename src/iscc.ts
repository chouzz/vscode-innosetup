import { window, WorkspaceConfiguration, workspace } from 'vscode';

import * as path from 'path';
import { platform } from 'os';
import { spawn } from 'child_process';
import { detectOutfile, getConfig, runInstaller } from './util';
import { outputChannel } from './channel';

async function build(): Promise<void> {
    const pathToIscc = getConfig<string>('pathToIscc');
    const showNotifications = getConfig<string>('showNotifications');
    const scriptPath = getConfig<string>('scriptPath');

    if (pathToIscc === 'ISCC.exe' && platform() !== 'win32') {
        window.showWarningMessage(
            'This command is only available on Windows. See README for workarounds on non-Windows.',
        );
        return;
    }

    const doc = window.activeTextEditor.document;
    const scriptFile = getScriptFile(doc.fileName, scriptPath);

    doc.save().then(async () => {
        await outputChannel.clear();

        // Let's build
        const iscc = spawn(pathToIscc, [scriptFile]);

        let outFile = '';

        iscc.stdout.on('data', (line: string) => {
            outputChannel.appendLine(line.toString());

            if (platform() === 'win32' && outFile === '') {
                outFile = detectOutfile(line);
            }
        });

        iscc.stderr.on('data', (line: string) => {
            outputChannel.appendLine(line.toString());
        });

        iscc.on('close', (code) => {
            const openButton = platform() === 'win32' && outFile !== '' ? 'Run' : null;
            if (code === 0) {
                if (showNotifications) {
                    window
                        .showInformationMessage(`Successfully compiled '${scriptFile}'`, openButton)
                        .then(async (choice) => {
                            if (choice === 'Run') {
                                await runInstaller(outFile);
                            }
                        });
                }
            } else {
                outputChannel.show(true);
                if (showNotifications) {
                    window.showErrorMessage('Compilation failed, see output for details');
                }
            }
        });
    });
}

function getScriptFile(activeFile: string, scriptPath?: string): string {
    if (!scriptPath) {
        return activeFile;
    }

    if (path.isAbsolute(scriptPath)) {
        return scriptPath;
    }

    const root = workspace.rootPath || path.dirname(activeFile);
    return path.join(root, scriptPath);
}

export { build };
