// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


const insertText = (val: string) => {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		vscode.window.showErrorMessage('Can\'t insert log because no document is open');
		return;
	}

	const selection = editor.selection;

	const range = new vscode.Range(selection.start, selection.end);
	console.log('range: ', range);

	editor.edit((editBuilder) => {
		editBuilder.replace(range, val);
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fastPrinter" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const insertPrintStatement = vscode.commands.registerCommand('extension.insertPrintStatement', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const selection = editor.selection;
		const text = editor.document.getText(selection);

		// Get file type
		const fullPath = editor.document.fileName;
		const fileName = fullPath.replace(/^.*[\\\/]/, '');
		const [_, suffix] = fileName.split('.');
		if (suffix) {
			let logToInsert = '';
			switch (suffix) {
				case 'js':
				case 'jsx':
				case 'ts':
					logToInsert = text ? `console.log('${text}: ', ${text});` : 'console.log();';
					break;
				case 'py': // python
				case 'rb': // ruby
					logToInsert = text ? `print('${text}: ', ${text})` : 'print()';
					break;
				case 'java': // java
					logToInsert = text ? `System.out.print('${text}: ', ${text});` : 'System.out.print(\'default\');';
					break;
				default:
					logToInsert = text ? `console.log('${text}: ', ${text});` : 'console.log();';
					break;
			}

			vscode.commands.executeCommand('editor.action.insertLineAfter')
				.then(() => {
					insertText(logToInsert);
				});
		} else {
			vscode.window.showErrorMessage('Can\'t find file suffix name');
			return;
		}
	});

	context.subscriptions.push(insertPrintStatement);
}

// this method is called when your extension is deactivated
export function deactivate() { }
