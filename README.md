Add a few extra context variables to be used in key binding `when` clause.

The following extra context variables are set:

* `extraContext:editorSelectionStartLine` : the start line of the selection as a string
* `extraContext:editorSelectionEndLine` : the end line of the selection as a string
* `extraContext:editorSelectionHasMultipleLines` : boolean that is true if the selection spans multiple lines


# editorSelectionHasMultipleLines

Sometimes it is needed to adjust your command based on if there are more than 1 line selected.

The following example uses a terminal `echo` command for demonstration that the context variables exist.

The example uses the extension [multi-command](https://marketplace.visualstudio.com/items?itemName=ryuta46.multi-command) by ryuta46.

In `settings.json`:

``` json
  "multiCommand.commands": [
    {
      "command": "multiCommand.terminalSingleLine",
      "sequence": [
        { "command": "workbench.action.terminal.sendSequence",
          "args": { "text": "echo Single Line\u000D" }
        }
      ]
    },
    {
      "command": "multiCommand.terminalMultipleLine",
      "sequence": [
        { "command": "workbench.action.terminal.sendSequence",
          "args": { "text": "echo Multiple Lines\u000D" }
        }
      ]
    }
  ]
```

In `keybindings.json`:

``` json
  {
    "key": "ctrl+k f5", // or any other key combo
    "command": "multiCommand.terminalSingleLine",
    "when": "editorTextFocus && !extraContext:editorSelectionHasMultipleLines"
  },
  {
    "key": "ctrl+k f5",
    "command": "multiCommand.terminalMultipleLine",
    "when": "editorTextFocus && extraContext:editorSelectionHasMultipleLines"
  }
```