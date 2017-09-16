'use strict';

import { workspace, window } from 'vscode';

import { platform } from 'os';
import { spawn } from 'child_process';

const outputChannel = window.createOutputChannel('Inno Setup');

const build = () => {
  const config = workspace.getConfiguration('innosetup');

  if (config.pathToIscc === 'ISCC.exe' && platform() !== 'win32') {
    return window.showWarningMessage('This command is only available on Windows. See README for workarounds on non-Windows.');
  }

  const doc = window.activeTextEditor.document;

  doc.save().then( () => {
    outputChannel.clear();
    if (config.alwaysShowOutput === true) {
      outputChannel.show();
    }

    // Let's build
    const iscc = spawn(config.pathToIscc, [ doc.fileName ]);

    iscc.stdout.on('data', (data) => {
      outputChannel.appendLine(data.toString());
    });

    iscc.stderr.on('data', (data) => {
      outputChannel.appendLine(data.toString());
    });

    iscc.on('close', (code) => {
      if (code === 0) {
        if (config.showNotifications) window.showInformationMessage(`Successfully compiled '${doc.fileName}'`);
      } else {
        outputChannel.show(true);
        if (config.showNotifications) window.showErrorMessage('Compilation failed, see output for details');
      }
    });
  });
};

export { build };
