import vscode from 'vscode';

import { getConfig } from 'vscode-get-config';
import { promises as fs } from 'fs';
import { join } from 'path';

async function createTask(): Promise<void> {
  if (typeof vscode.workspace.rootPath === 'undefined' || vscode.workspace.rootPath === null) {
    vscode.window.showErrorMessage('Task support is only available when working on a workspace folder. It is not available when editing single files.');
    return;
  }

  const { alwaysOpenBuildTask, pathToIscc } = await getConfig('nsis');

  const taskFile = {
      'version': '2.0.0',
      'tasks': [
          {
              'label': 'Inno Setup: Compile Script',
              'type': 'process',
              'command': pathToIscc,
              'args': ['${file}'],
              'presentation': {
                  'reveal': 'always',
                  'echo': false
              },
              'group': {
                  'kind': 'build',
                  'isDefault': true
              }
          }
      ]
  };

  const jsonString: string = JSON.stringify(taskFile, null, 2);
  const dotFolder: string = join(vscode.workspace.rootPath, '/.vscode');
  const buildFile: string = join(dotFolder, 'tasks.json');

  try {
    await fs.mkdir(dotFolder);
  } catch (error) {
    console.warn(error);
  }

  // ignore errors for now
  try {
    await fs.writeFile(buildFile, jsonString);

  } catch(error) {
    vscode.window.showErrorMessage(error.toString());
  }

  if (alwaysOpenBuildTask === false) return;

  // Open tasks.json
  const doc = await vscode.workspace.openTextDocument(buildFile)
  vscode.window.showTextDocument(doc);
}

export { createTask };
