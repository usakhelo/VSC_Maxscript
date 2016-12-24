'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class GoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(
        document: vscode.TextDocument, token: vscode.CancellationToken):
        vscode.SymbolInformation[] {
            var loc1 = new vscode.Location(new vscode.Uri(), new vscode.Position(10, 10));
            var sym1 = new vscode.SymbolInformation("test1", vscode.SymbolKind.Function, "file", loc1);
            var sym2 = new vscode.SymbolInformation("test2", vscode.SymbolKind.Function, "file", loc1);
            var temp: vscode.SymbolInformation[] = [sym1, sym2];
            return temp;
    }
}

export function activate(ctx: vscode.ExtensionContext): void {
    // ...
    ctx.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(
            'maxscript', new GoDocumentSymbolProvider()));
    // ...
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

//     // Use the console to output diagnostic information (console.log) and errors (console.error)
//     // This line of code will only be executed once when your extension is activated
//     console.log('Congratulations, your extension "vsc-maxscript" is now active!');

//     // The command has been defined in the package.json file
//     // Now provide the implementation of the command with  registerCommand
//     // The commandId parameter must match the command field in package.json
//     let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
//         var editor = vscode.window.activeTextEditor;
//         if (!editor) {
//             return; // No open text editor
//         }

//         var selection = editor.selection;
//         var text = editor.document.getText(selection);

//         // Display a message box to the user
//         vscode.window.showInformationMessage('Selected characters: ' + text.length);
//         // Display a message box to the user
//         vscode.window.showInformationMessage('Hello World!');
//     });

//     context.subscriptions.push(disposable);
// }

// this method is called when your extension is deactivated
export function deactivate() {
}