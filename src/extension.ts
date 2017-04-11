'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class GoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        vscode.SymbolInformation[] {
            let script_text = document.getText();
            let funcReStr = /\b(function|fn|rollout|rcmenu|utility|plugin|button)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gi;
            let structReStr = /\b(struct)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gi;
            
            let regex_result = [];
            let result: vscode.SymbolInformation[] = [];
            let sym_str:String;
            while ((regex_result = funcReStr.exec(script_text)) !== null) {
                if (regex_result.length > 0) {
                    if (regex_result[0].length > 0) {
                        sym_str = regex_result[0];
                        let loc = new vscode.Location(new vscode.Uri(), document.positionAt(funcReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(regex_result[0], vscode.SymbolKind.Function, '', loc);
                        result.push(sym)
                    }
                }
            }
            while ((regex_result = structReStr.exec(script_text)) !== null) {
                if (regex_result.length > 0) {
                    if (regex_result[0].length > 0) {
                        sym_str = regex_result[0];
                        let loc = new vscode.Location(new vscode.Uri(), document.positionAt(structReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(regex_result[0], vscode.SymbolKind.Function, '', loc);
                        result.push(sym)
                    }
                }
            }
            
            return result;
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    ctx.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            'maxscript', new GoDocumentSymbolProvider()));
}

// this method is called when your extension is deactivated
export function deactivate() {
}