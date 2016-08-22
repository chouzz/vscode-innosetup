'use strict';

const exec = require('child_process').exec;
const os = require('os');
const vscode = require('vscode');

function buildCommand (textEditor, config) {
  let doc, iscc

  doc = textEditor.document;
  iscc = config.pathToIscc;

  if (iscc === "ISCC.exe" && os.platform() !== 'win32') {
    return vscode.window.showWarningMessage("This command is only available on Windows. See README on for workarounds on non-Windows.");
  }

  doc.save()

  exec("\"" + iscc + "\" /Q \"" + doc.fileName + "\"", function(error, stdout, stderr) {
    if (error !== null) {
      return vscode.window.showErrorMessage(stderr);
    } else {
      return vscode.window.showInformationMessage("Successfully compiled \"" + doc.fileName + "\"");
    }
  });
}

module.exports = buildCommand;
