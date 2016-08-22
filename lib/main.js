'use strict';

const vscode = require('vscode');
const buildCommand = require('./build');

var config = vscode.workspace.getConfiguration('innosetup');

module.exports = {
  activate (context) {
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand('extension.innosetup.compile', (editor) => {
        return buildCommand(editor, config);
      })
    );
  },
  deactivate () { }
};
