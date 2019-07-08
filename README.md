# Fast Printer

A VS Code plugin to help insert print statements in different languages.

## Usage

### Insert print statement

Select content(usually a variable name) and press `shift+command+;` at the same time.
(Make surce `insertPrintStatement` has been placed at preference => keybords shortcut )

It will insert a print statement like:
- `console.log("${variable}: ", variable)`
- `print("#{variable}: ", variable)`

![](https://upload-images.jianshu.io/upload_images/2674994-245ef3be8e6d62aa.gif?imageMogr2/auto-orient/strip)

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