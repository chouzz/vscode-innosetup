import * as vscode from 'vscode';
import * as path from 'path';

export class BuildTaskProvider implements vscode.TaskProvider {
    public provideTasks(
        token?: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Task[]> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return [];
        }
        const file = editor.document.fileName;
        const isIssFile = path.extname(file.toLowerCase()) === '.iss';
        if (!isIssFile) {
            return [];
        }
        const excutable =
            vscode.workspace
                .getConfiguration('innosetup')
                .get<string>('') || '';
        const execution = new vscode.ShellExecution(excutable, [
            {
                value: file,
                quoting: vscode.ShellQuoting.Strong,
            },
        ]);
        const taskDef = {
            type: 'innosetup',
        };
        const task = new vscode.Task(
            taskDef,
            vscode.TaskScope.Workspace,
            'compile script',
            'innosetup',
            execution,
            ['innosetup-6-error', 'innosetup-5-error', 'innosetup-5-warning'],
        );
        task.source = 'innosetup';
        task.group = vscode.TaskGroup.Build;
        return [task];
    }
    public resolveTask(
        task: vscode.Task,
        token?: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Task> {
        return task;
    }
}
