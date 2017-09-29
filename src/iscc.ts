'use strict';

import { workspace, window } from 'vscode';

import { platform } from 'os';
import { spawn } from 'child_process';
import { clearOutput, detectOutfile, getConfig, runInstaller } from './util';

const innoChannel = window.createOutputChannel('Inno Setup');

const build = () => {
  const config: any = getConfig();

  if (config.pathToIscc === 'ISCC.exe' && platform() !== 'win32') {
    return window.showWarningMessage('This command is only available on Windows. See README for workarounds on non-Windows.');
  }

  const doc = window.activeTextEditor.document;

  doc.save().then( () => {
    clearOutput(innoChannel);

    // Let's build
    const iscc = spawn(config.pathToIscc, [ doc.fileName ]);

    let outFile: string = '';

    iscc.stdout.on('data', (line: Array<any>) => {
      innoChannel.appendLine(line.toString());

      if (platform() === 'win32' && outFile === '') {
        outFile = detectOutfile(line);
      }
    });

    iscc.stderr.on('data', (line:  Array<any>) => {
      innoChannel.appendLine(line.toString());
    });

    iscc.on('close', (code) => {
      let openButton = (platform() === 'win32' && outFile !== '') ? 'Run' : null;
      if (code === 0) {
        if (config.showNotifications) {
          window.showInformationMessage(`Successfully compiled '${doc.fileName}'`, openButton)
          .then((choice) => {
            if (choice === 'Run') {
              runInstaller(outFile);
            }
          });
        }
      } else {
        innoChannel.show(true);
        if (config.showNotifications) window.showErrorMessage('Compilation failed, see output for details');
      }
    });
  });
};

export { build };
