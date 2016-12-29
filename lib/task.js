'use babel';

const vscode = require('vscode');

const fs = require('fs');
const path = require('path');

const meta = require('../package.json');

function createTaskCommand (textEditor) {
  if (typeof vscode.workspace.rootPath === 'undefined' || vscode.workspace.rootPath === null) {
    return vscode.window.showErrorMessage("Task support is only available when working on a workspace folder. It is not available when editing single files.");
  }

  let buildFile, command, config, dotFolder, jsonString, taskFile;

  config = vscode.workspace.getConfiguration('innosetup');
  command = config.pathToIscc;

  taskFile = {
      'command': command,
      'version': meta.version,
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

  jsonString = JSON.stringify(taskFile, null, 2);
  dotFolder = path.join(vscode.workspace.rootPath, '/.vscode');
  buildFile = path.join(dotFolder, 'tasks.json');

  fs.mkdir(dotFolder, function(error) {
    // ignore errors for now
    fs.writeFile(buildFile, jsonString, function(error) {
      if (error) {
        return vscode.window.showErrorMessage(error);
      }
      if (config.alwaysOpenBuildTask === false) return;

      // Open tasks.json
      vscode.workspace.openTextDocument(buildFile).then(function (doc) {
          vscode.window.showTextDocument(doc);
      });
    });
  });
}

module.exports = createTaskCommand;
