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
        // contants hover provder
        const tokenRange =
            document.getWordRangeAtPosition(position, /\{\w+\}/g) ??
            document.getWordRangeAtPosition(position);
        if (!tokenRange) {
            return null;
        }
        const text = document.getText(tokenRange);
        const variable =
            this._context.constants.find((el) => el.value == text) ||
            this._context.directives.find((el) => el.value == text) ||
            this._context.params.find((el) => el.value == text);
        if (variable) {
            const markdown = new vscode.MarkdownString(variable.description);
            markdown.supportHtml = true;
            return new vscode.Hover(markdown);
        }
    }
}
