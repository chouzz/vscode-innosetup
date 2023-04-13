import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from 'child_process';

export interface BuildTaskDefinition extends vscode.TaskDefinition {
    type: string;
    label: string;
    command: string;
    args: string[];
    options: cp.ExecOptions | undefined;
}

export class BuildTaskProvider implements vscode.TaskProvider {
    static buildScriptType = 'innosetup-build';
    static buildSourceStr = 'innosetup';
    private tasks: vscode.Task[] | undefined;
    public provideTasks(token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task[]> {
        if (this.tasks) {
            return this.tasks;
        }
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return [];
        }
        const file = editor.document.fileName;
        const isIssFile = path.extname(file.toLowerCase()) === '.iss';
        if (!isIssFile) {
            return [];
        }
        const compilerPath = vscode.workspace.getConfiguration('innosetup').get<string>('pathToIscc') || '';
        this.tasks = [this.getTask(compilerPath)];
        return this.tasks;
    }
    public resolveTask(task: vscode.Task, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.Task> {
        return this.getTask(task.definition.command, task.definition.args, task.definition as BuildTaskDefinition);
    }

    private getTask(compilerPath: string, compilerArgs?: string[], definition?: BuildTaskDefinition) {
        const taskLabel = 'compile script';
        const cwd = '${workspaceFolder}';
        const args = compilerArgs && compilerArgs.length ? compilerArgs: ['${file}'];
        const options: cp.ExecOptions | undefined = { cwd: cwd };
        if (!definition) {
            definition = {
                type: BuildTaskProvider.buildScriptType,
                label: taskLabel,
                command: compilerPath,
                args: args,
                options: options,
            };
        }
        const scope = vscode.TaskScope.Workspace;
        const task = new vscode.Task(
            definition,
            scope,
            taskLabel,
            BuildTaskProvider.buildSourceStr,
            new vscode.ShellExecution(compilerPath, args, {
                cwd: cwd
            }),
            ['$innosetup-6-error', '$innosetup-5-error', '$innosetup-5-warning'],
        );
        task.group = vscode.TaskGroup.Build;
        task.detail = 'compiler: ' + compilerPath;

        return task;
    }
}
