'use babel';

import { workspace, window } from 'vscode';

import { mkdir, writeFile } from 'fs';
import { join } from 'path';

const { version } = require('../package.json');

const createTask = () => {
  if (typeof workspace.rootPath === 'undefined' || workspace.rootPath === null) {
    return window.showErrorMessage('Task support is only available when working on a workspace folder. It is not available when editing single files.');
  }

  const config = workspace.getConfiguration('innosetup');
  const command: string = config.pathToIscc;

  const taskFile: Object = {
      'command': command,
      'version': version,
      'args': [],
      'isShellCommand': false,
      'showOutput': 'always',
      'suppressTaskName': true,
      'echoCommand': false,
      'tasks': [
        {
          'taskName': 'Build',
          'args': [ '${file}' ],
          'isBuildCommand': true
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
        return window.showErrorMessage(error);
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
