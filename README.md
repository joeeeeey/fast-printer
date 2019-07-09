# Fast Printer

A VS Code plugin to help insert print statements in different languages.

## Usage

### Insert print statement

Select content(usually a variable name) and press `shift+command+;` at the same time.
(Make surce `insertPrintStatement` has been placed at preference => keybords shortcut )

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
- bash
- go

## TODO

More languages support.