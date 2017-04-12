'use strict';
import * as vscode from 'vscode';

class MaxscriptDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
        return new Promise<vscode.Definition>((resolve, reject) => {
            let wordRange = document.getWordRangeAtPosition(position);
            let word = document.getText(wordRange);
            let lineText = document.lineAt(position.line).text;
            console.log(word);
            if (!wordRange || lineText.startsWith('//') || lineText.startsWith('--') || word.match(/^\d+.?\d+$/) /*|| isPositionInString(document, position) || maxscriptKeywords.indexOf(word) > 0*/ ) {
                resolve(null);
            }
            //should skip maxscript keywords, comments, string literals
            //should consider current scope somehow...

            //find definition in the array of document symbols
            let result = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
            result.then((symbols:Array<vscode.SymbolInformation>) => {
                  let sym_location: vscode.Location;
                  let test = symbols.find((sym_inf) => {
                      if (sym_inf.name == word){
                          sym_location = sym_inf.location;
                          return true;
                      }
                      return false;
                  });
                  if (test)
                    resolve(sym_location);
                  else
                    resolve(null);
                }, (reason) => {
                      console.log(reason); // Error!
                    });
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
                        sym_str = regex_result[2];
                        let loc = new vscode.Location(document.uri, document.positionAt(funcReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(sym_str, vscode.SymbolKind.Function, '', loc);
                        result.push(sym)
                    }
                }
            }
            while ((regex_result = structReStr.exec(script_text)) !== null) {
                if (regex_result.length > 0) {
                    if (regex_result[1].length > 0) {
                        sym_str = regex_result[2];
                        let loc = new vscode.Location(document.uri, document.positionAt(structReStr.lastIndex - sym_str.length));
                        let sym = new vscode.SymbolInformation(sym_str, vscode.SymbolKind.Class, '', loc);
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