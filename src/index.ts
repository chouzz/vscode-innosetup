import * as vscode from 'vscode';
import { BuildTaskProvider } from './buildTaskProvider';
import * as hoverProvider from './hoverProvider';
import * as telemetry from './telemetry';
// Load package components
import { build } from './iscc';
import { createTask } from './task';

async function activate(context: vscode.ExtensionContext): Promise<void> {
    telemetry.activate(context);
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(
            'extension.innosetup.compile',
            async () => {
                telemetry.reporter.sendTelemetryEvent('innosetup.compile');
                return await build();
            },
        ),
    );
    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand(
            'extension.innosetup.create-build-task',
            async () => {
                telemetry.reporter.sendTelemetryEvent('innosetup.create-build-task');
                return await createTask();
            },
        ),
    );
    context.subscriptions.push(
        vscode.tasks.registerTaskProvider(BuildTaskProvider.buildScriptType, new BuildTaskProvider()),
    );

    hoverProvider.activate(context);
}

export { activate };
