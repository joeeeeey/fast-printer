# Fast Printer

A VS Code plugin to help insert print statements in different languages.

## Usage
![demo](https://raw.githubusercontent.com/joeeeeey/fast-printer/master/resources/demo.gif)

### Insert print statement

Click or select the text(usually a variable name) and press `shift+command+;` at the same time.

It will insert a print statement like:
```javascript
// .js | .ts | .jsx
console.log("variable: ", variable)
```

```python
# .py | .rb
print("variable: ", variable)
```

```go
// .go
fmt.Println("variable: ", variable)
```

### Remove all print statements

`shift+command+'`

## Support languages

- Javascript(`.js|.jsx`)
- TypeScript(`.ts`)
- Ruby(`.rb`)
- Python(`.py`)
- Java(`.java`)
- Go(`.go`)
- Bash(`.sh`)

Note: Fast printer discover language by *file suffix*.

## Issues

- The hotkey not work
  - Make sure `insertPrintStatement` has been placed at `Preference => Keybords Shortcut` and has no other conflict.



## TODO
- More languages support.
- Customized config for auto select word.