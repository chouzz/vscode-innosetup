import * as vscode from 'vscode';
import { getLanguageContext, LanguageContext } from './isetupParser';

export async function activate(context: vscode.ExtensionContext) {
    const hoverProvider = new InnosetupHoverProvder(
        getLanguageContext(context),
    );
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { language: 'innosetup' },
            hoverProvider,
        ),
    );
}

export class InnosetupHoverProvder implements vscode.HoverProvider {
    constructor(private _context: LanguageContext) {}
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Hover> {
        const tokenRange = document.getWordRangeAtPosition(position, /\{\w+\}/g);
        if (!tokenRange) {
            return null;
        }
        const text = document.getText(tokenRange);
        const constant = this._context.constants.find((el) => el.value == text);
        if (constant) {
            const markdown = new vscode.MarkdownString(constant.description);
            markdown.supportHtml = true;
            return new vscode.Hover(markdown);
        }
    }
}
