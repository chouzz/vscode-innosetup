'use strict';

import { workspace, WorkspaceConfiguration } from 'vscode';

import { existsSync } from 'fs';
import { platform } from 'os';
import { spawn } from 'child_process';
import { getConfig } from 'vscode-get-config';

async function clearOutput(channel): Promise<void> {
  let alwaysShowOutput: boolean = await getConfig('innosetup.alwaysShowOutput');

  channel.clear();
  if (alwaysShowOutput === true) {
    channel.show(true);
  }
}

function detectOutfile(line): string {
  if (line.indexOf('Resulting Setup program filename is:') !== -1) {
    let regex = /\r?\n(.*\.exe)\s*$/g;
    let result = regex.exec(line.toString());

    if (typeof result === 'object') {
      try {
        return (existsSync(result['1']) === true) ? result['1'] : '';
      } catch (e) {
        return '';
      }
    }
  }

  return '';
}

async function runInstaller(outFile) {
  let useWineToRun: boolean = await getConfig('innosetup.useWineToRun');

  if (platform() === 'win32') {
    return spawn(outFile);
  } else if (useWineToRun === true) {
    return spawn('wine', [ outFile ]);
  }
}

export {
  clearOutput,
  detectOutfile,
  getConfig,
  runInstaller,
};
