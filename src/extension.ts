'use strict';
import * as vscode from 'vscode';
import { resolve } from 'dns';

// Store definitions ?
// export interface symbolWrapper {symbols: vscode.SymbolInformation[]}
// export var symbolDefinitions: symbolWrapper; 

export class MaxscriptDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
        return new Promise<vscode.Definition>((resolve, reject) => {
            // get current word
            let wordRange = document.getWordRangeAtPosition(position);
            let word = document.getText(wordRange);
            // skip single line comments.. block comments should take in account word context
            let lineText = document.lineAt(position.line).text;
            let lineTillCurrentPosition = lineText.substr(0, position.character);
            if (lineTillCurrentPosition.includes('--')) { reject(null);}

            // This will not work for comments at eol or block comments
            //if (!wordRange || lineText.startsWith('//') || lineText.startsWith('--') || word.match(/^\d+.?\d+$/)) { resolve(null); }
            /*
            * should skip maxscript keywords, comments, string literals > No need, just definition will not be found
            * should consider current scope somehow...needs lexer/parser. Best implementation should be tou use a language server and keep the document tokenized.
            * Direct implementation: find definition in the array of document symbols (how?) executeDocumentSymbolProvider seems inneficient
            * We could just do a regex search for the keyword, since maxscript has an ordered flow and we dont be looking for workspace symbols...
            */
            let result = vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
            result.then((symbols:Array<vscode.SymbolInformation>) => {

                let findSymbol = symbols.find(item => item.name === word)
                if (findSymbol) {
                    resolve(findSymbol.location);
                } else {reject(null);}

/*                slet sym_location: vscode.Location;
                  let test = symbols.find((sym_inf) => {
                      if (sym_inf.name === word){
                          sym_location = sym_inf.location;
                          return true;
                      }
                      return false;
                  });
                  if (test)
                    resolve(sym_location);
                  else
                    reject(null); */

                }, (reason) => { reject(reason);}
            );
        });
    }
}

export class MaxscriptDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    //private getDocumentSymbols (ctx: vscode.ExtensionContext, document:vscode.TextDocument, mxsSymbols:symbolWrapper): vscode.SymbolInformation[] {
    private getDocumentSymbols (document:vscode.TextDocument): vscode.SymbolInformation[] {

        let result = new Array<vscode.SymbolInformation>();

        let script_text = document.getText();
        let funcReStr = /^\s*\b(function|fn|rollout|rcmenu|utility|plugin|button|on)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gim;
        let structReStr = /^\s*\b(struct)\s+([a-zA-Z_0-9:]*)(\s+[a-zA-Z_0-9:]*)*\b/gim;

        let regex_result = [];
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
        // mxsSymbols.symbols = result;
        return (result);
    }
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
            return new Promise((resolve, reject) => {
                // resolve (this.getDocumentSymbols(document,symbolDefinitions));
                resolve (this.getDocumentSymbols(document));
            });            
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
export function deactivate() {}