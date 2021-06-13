import { existsSync } from 'fs';
import { platform } from 'os';
import { spawn } from 'child_process';
import { getConfig } from 'vscode-get-config';

function detectOutfile(line: string): string {
  if (line.indexOf('Resulting Setup program filename is:') !== -1) {
    const regex = /\r?\n(.*\.exe)\s*$/g;
    const result = regex.exec(line.toString());

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

async function runInstaller(outFile: string): Promise<void> {
  const useWineToRun: boolean = await getConfig('innosetup.useWineToRun');

  if (platform() === 'win32') {
    spawn(outFile);
  } else if (useWineToRun === true) {
    spawn('wine', [ outFile ]);
  }
}

export {
  detectOutfile,
  runInstaller,
};
