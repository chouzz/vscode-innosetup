'use strict';

const os = require('os');
const vscode = require('vscode');
const spawn = require('child_process').spawn;
const outputChannel = vscode.window.createOutputChannel("Inno Setup");

function buildCommand (textEditor, config) {
  let doc, pathToIscc

  pathToIscc = config.pathToIscc;

  if (pathToIscc === "ISCC.exe" && os.platform() !== 'win32') {
    return vscode.window.showWarningMessage("This command is only available on Windows. See README for workarounds on non-Windows.");
  }

  doc = textEditor.document;
  doc.save();

  outputChannel.clear();
  if (config.alwaysShowOutput === true) {
    outputChannel.show();
  }
  
  // Let's build
  const iscc = spawn(pathToIscc, [ doc.fileName ]);

  iscc.stdout.on('data', (data) => {
    outputChannel.appendLine(data);
  });

  iscc.stderr.on('data', (data) => {
    outputChannel.appendLine(data);
  });

  iscc.on('close', (code) => {
    if (code === 0) {
      if (config.showNotifications) vscode.window.showInformationMessage("Successfully compiled \"" + doc.fileName + "\"");
    } else {
      outputChannel.show(true);
      if (config.showNotifications) vscode.window.showErrorMessage("Compilation failed, see output for details");
    }
  });
}

module.exports = buildCommand;
