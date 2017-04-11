'use strict';
import * as vscode from 'vscode';

class MaxscriptDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
        return new Promise<vscode.Definition>((resolve, reject) => {
        let range = document.getWordRangeAtPosition(position);
        let symbol = document.getText(range);
        console.log(range);
        console.log(symbol);
        //probably should find first location of symbol in current file and in other file in workspace
        //should skip maxscript keywords, comments, string literals
        //     if (!wordRange || lineText.startsWith('//') || isPositionInString(document, position) || word.match(/^\d+.?\d+$/) || goKeywords.indexOf(word) > 0) {
        // return Promise.resolve(null);
        //workspace.findFiles(ui5tsglobal.core.CreateRelativePath(tag[1]) + controllerFileEx, undefined);
        new vscode.Location(document.uri, new vscode.Position(0, 0));
        }); 
    }
}

class MaxscriptDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        vscode.SymbolInformation[] {
            let script_text = document.getText();
            let funcReStr = /^\s*\b(function|fn|rollout|rcmenu|utility|plugin|button|on)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gim;
            let structReStr = /^\s*\b(struct)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gim;
            
            let regex_result = [];
            let result: vscode.SymbolInformation[] = [];
            let sym_str:string;
            while ((regex_result = funcReStr.exec(script_text)) !== null) {
                if (regex_result.length > 0) {
                    // console.log(regex_result);
                    if (regex_result[1].length > 0) {
                        sym_str = regex_result[1] + " " +  regex_result[2];
                        let loc = new vscode.Location(document.uri, document.positionAt(funcReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(sym_str, vscode.SymbolKind.Function, '', loc);
                        result.push(sym)
                    }
                }
            }
            while ((regex_result = structReStr.exec(script_text)) !== null) {
                if (regex_result.length > 0) {
                    if (regex_result[1].length > 0) {
                        sym_str = regex_result[1] + " " +  regex_result[2];
                        let loc = new vscode.Location(document.uri, document.positionAt(structReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(sym_str, vscode.SymbolKind.Function, '', loc);
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
            'maxscript', new MaxscriptDocumentSymbolProvider()));
    ctx.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            'maxscript', new MaxscriptDefinitionProvider()));
}

export function deactivate() {
}