'use babel';

import { window, workspace, WorkspaceConfiguration } from 'vscode';

import { mkdir, writeFile } from 'fs';
import { join } from 'path';

const createTask = () => {
  if (typeof workspace.rootPath === 'undefined' || workspace.rootPath === null) {
    return window.showErrorMessage('Task support is only available when working on a workspace folder. It is not available when editing single files.');
  }

  const config: WorkspaceConfiguration = workspace.getConfiguration('innosetup');

  const taskFile: Object = {
      'version': '2.0.0',
      'tasks': [
          {
              'label': 'Inno Setup: Compile Script',
              'type': 'process',
              'command': config.pathToIscc,
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
  const dotFolder: string = join(workspace.rootPath, '/.vscode');
  const buildFile: string = join(dotFolder, 'tasks.json');

  mkdir(dotFolder, (error) => {
    // ignore errors for now
    writeFile(buildFile, jsonString, (error) => {
      if (error) {
        return window.showErrorMessage(error.toString());
      }
      if (config.alwaysOpenBuildTask === false) return;

      // Open tasks.json
      workspace.openTextDocument(buildFile).then( (doc) => {
          window.showTextDocument(doc);
      });
    });
  });
};

export { createTask };
