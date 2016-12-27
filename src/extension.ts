'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class GoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        vscode.SymbolInformation[] {
            var conf1 = vscode.workspace.getConfiguration('maxscript');
            var conf2 = vscode.workspace.getConfiguration('support.function.maxscript.custom');
            document.getText();
            document.getWordRangeAtPosition(new vscode.Position(10, 10));
            
            var text1 = document.getText();
            var funcReStr = /\b(function|fn|rollout|rcmenu|utility|plugin|button)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gi;
            var structReStr = /\b(struct)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gi;
            
            var myArray;
            while ((myArray = funcReStr.exec(text1)) !== null) {
                var msg = 'Found ' + myArray[0] + '. ';
                msg += 'Next match starts at ' + funcReStr.lastIndex;
                console.log(msg);
            }
            
            var loc1 = new vscode.Location(new vscode.Uri(), new vscode.Position(10, 10));
            var sym1 = new vscode.SymbolInformation("test1", vscode.SymbolKind.Function, "file", loc1);
            var sym2 = new vscode.SymbolInformation("test2", vscode.SymbolKind.Function, "file", loc1);
            var temp: vscode.SymbolInformation[] = [sym1, sym2];
            return temp;
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