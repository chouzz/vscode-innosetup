'use strict';

import { window, workspace } from 'vscode';

import { existsSync } from 'fs';
import { platform } from 'os';
import { spawn } from 'child_process';

const clearOutput = (channel): void => {
  let config: any = getConfig();

  channel.clear();
  if (config.alwaysShowOutput === true) {
    channel.show(true);
  }
};

const detectOutfile = (line): string => {
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
};

const getConfig = () => {
  return workspace.getConfiguration('innosetup');
};

const runInstaller = (outFile) => {
  let config: any = getConfig();

  if (platform() === 'win32') {
    return spawn(outFile);
  } else if (config.useWineToRun === true) {
    return spawn('wine', [ outFile ]);
  }
};

export {
  clearOutput,
  detectOutfile,
  getConfig,
  runInstaller,
};
