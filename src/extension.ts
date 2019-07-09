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

  editor.edit((editBuilder) => {
    editBuilder.replace(range, val);
  });
};

const getFilePathSuffix = (editor: any) => {
  const fullPath = editor.document.fileName;
  const fileName = fullPath.replace(/^.*[\\\/]/, '');
  const [_, suffix] = fileName.split('.');
  return suffix;
};

const logExist = (editor: any, fileSuffix: string, document: any, documentText: any) => {
  let logStatements = [];

  let logRegex: any;
  switch (fileSuffix) {
    case 'js':
    case 'jsx':
    case 'ts':
      logRegex = /console.(log)\((.*)\);?/g;
      break;
    case 'py': // python
    case 'rb': // ruby
      logRegex = /print\((.*)\);?/g;
      break;
    case 'java': // java
      logRegex = /System.out.print\((.*)\);?/g;
      break;
    case 'go': // go
      logRegex = /fmt.(Println)\((.*)\);?/g;
      break;
    case 'sh': // shell
      logRegex = /echo(.*);?/g;
      break;
    default:
      logRegex = /console.(log)\((.*)\);?/g;
      break;
  }

  let selections = [];

  let match;
  while (match = logRegex.exec(documentText)) {
    let matchRange =
      new vscode.Range(
        document.positionAt(match.index),
        document.positionAt(match.index + match[0].length)
      );

    const selection = new vscode.Selection(
      document.positionAt(match.index),
      document.positionAt(match.index + match[0].length),
    );

    selections.push(selection);

    if (!matchRange.isEmpty) {
      logStatements.push(matchRange);
    }
  }

  editor.selections = selections;

  return selections.length > 0;
};

const getFarthestLetterPosition = (direction: string, cursorSelection: any, editor: any) => {
  let currentCharacterPosition = cursorSelection.character;
  while (true) {
    // Assume all the words in VScode always at one line.
    if (currentCharacterPosition > 0 || direction === 'right') {
      const offsetTextRange = new vscode.Range(
        new vscode.Position(
          cursorSelection.line,
          direction === 'right' ? currentCharacterPosition : currentCharacterPosition - 1
        ),
        new vscode.Position(
          cursorSelection.line,
          direction === 'right' ? currentCharacterPosition + 1 : currentCharacterPosition
        ),
      );
      const offsetText = editor.document.getText(offsetTextRange);

      // Is not an assumed variable? Should it be configed?
      if (!offsetText.match(/^[a-zA-Z0-9_]+$/)) {
        return currentCharacterPosition;
      }

      direction === 'left' ? currentCharacterPosition -= 1 : currentCharacterPosition += 1;
    } else {
      return currentCharacterPosition;
    }
  }
};

const getAutoSelectedText = (editor: any) => {
  const selection = editor.selection;
  const start = selection.start;
  const end = selection.end;
  // Has no seletion text
  if (start.line === end.line &&
    start.character === end.character) {
    const cursorSelection = editor.selection.active;

    const leftFarthestLetterPosition = getFarthestLetterPosition('left', cursorSelection, editor);
    const rightFarthestLetterPosition = getFarthestLetterPosition('right', cursorSelection, editor);
    if (leftFarthestLetterPosition < rightFarthestLetterPosition) {
      const autoSelectedTextRange = new vscode.Range(
        new vscode.Position(
          cursorSelection.line,
          leftFarthestLetterPosition
        ),
        new vscode.Position(
          cursorSelection.line,
          rightFarthestLetterPosition
        ),
      );

      const autoSelectedText = editor.document.getText(autoSelectedTextRange);
      if (autoSelectedText) {
        return autoSelectedText;
      }
      return null;
    }
    return null;
  }
  return null;
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const insertPrintStatement = vscode.commands.registerCommand('extension.insertPrintStatement', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const selection = editor.selection;

    let text = editor.document.getText(selection);

    if (!text) {
      text = getAutoSelectedText(editor);
    }
    // Get file type
    const suffix = getFilePathSuffix(editor);
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
        case 'go': // go
          logToInsert = text ? `fmt.Println("${text}: ", ${text})` : 'fmt.Println("")';
          break;
        case 'sh': // shell
          logToInsert = text ? `echo "${text} is: \${${text}}"` : 'echo ""';
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

  const deletePrintStatement = vscode.commands.registerCommand('extension.deletePrintStatement', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const document = editor.document;
    const documentText = editor.document.getText();
    const suffix = getFilePathSuffix(editor);

    // logExist will put cursor after each print statement.
    if (logExist(editor, suffix, document, documentText)) {
      vscode.commands.executeCommand('editor.action.deleteLines')
        .then(() => {
          console.log('DELETEED!')
        });
    }
  });

  context.subscriptions.push(insertPrintStatement);
  context.subscriptions.push(deletePrintStatement);
}

// this method is called when your extension is deactivated
export function deactivate() { }
