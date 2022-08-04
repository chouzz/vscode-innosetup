import * as vscode from 'vscode';
import { generate } from './generater';
import { BuildTaskProvider } from './buildTaskProvider';

// Load package components
import { build } from './iscc';
import { createTask} from './task';

async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('extension.innosetup.compile', async () => {
      return await build();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand('extension.innosetup.create-build-task', async () => {
      return await createTask();
    })
  );
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider('innosetup', new BuildTaskProvider())
  );
  generate();
}

export { activate };
