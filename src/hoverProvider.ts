import * as vscode from 'vscode';

export class InnosetupHoverProvder implements vscode.HoverProvider {
    constructor(private _wordMap: Map<string, string>) {}
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        const tokenRange = document.getWordRangeAtPosition(position);
        const tokenText = document.getText(tokenRange);
        if (this._wordMap.has(tokenText)) {
            return new vscode.Hover({
                language: 'xml',
                value: this._wordMap.get(tokenText),
            });
        }
        // FIXME : support constant like {app}
    }
}
