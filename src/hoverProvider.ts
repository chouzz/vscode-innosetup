import * as vscode from 'vscode';
import { readFile } from 'fs/promises';
import * as path from 'path';

export async function activate(context: vscode.ExtensionContext) {
    const constantMapPath = path.join(
        context.extensionPath,
        'script',
        'constant.json',
    );
    const constantsItems = await readFile(constantMapPath, {
        encoding: 'utf8',
    });
    const constItemsMap = new Map<string, string>(
        Object.entries(JSON.parse(constantsItems)),
    );
    const hoverProvider = new InnosetupHoverProvder(constItemsMap);

    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { language: 'innosetup' },
            hoverProvider,
        ),
    );
}

export class InnosetupHoverProvder implements vscode.HoverProvider {
    constructor(private _constantItems: Map<string, string>) {}
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        const tokenRange = document.getWordRangeAtPosition(position, /\{\w+\}/g);
        const tokenText = document.getText(tokenRange);
        // Remove '{' and '}'
        if (this._constantItems.has(tokenText.slice(1, -1))) {
            const description = this._constantItems.get(tokenText.slice(1, -1));
            const markdown = new vscode.MarkdownString(description);
            markdown.supportHtml = true;
            return new vscode.Hover(markdown);
        }
    }
}
