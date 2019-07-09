# Fast Printer

A VS Code plugin to help insert print statements in different languages.

## Usage

### Insert print statement

Click or select content(usually a variable name) and press `shift+command+;` at the same time.

It will insert a print statement like:
- `console.log("${variable}: ", variable)`
- `print("#{variable}: ", variable)`

![demo](https://raw.githubusercontent.com/joeeeeey/fast-printer/master/resources/demo.gif)

### Remove all print statements

`shift+command+'`

## Support languages

- Javascript
- TypeScript
- Ruby
- Python
- Java
- Go
- Bash

## Q&A

- The hotkey not work.

Make sure `insertPrintStatement` has been placed at `Preference => Keybords Shortcut` and has no other conflict.

## TODO

More languages support.