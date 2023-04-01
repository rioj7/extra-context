Add a few extra context variables to be used in key binding `when` clause. Or set a user defined context variable or toggle a user defined boolean context variable.

# Automatic context variables
The following extra context variables are set:

* `extraContext:editorSelectionStartLine` : the start line of the selection as a string
* `extraContext:editorSelectionStartCharacter` : the start character of the selection as a string
* `extraContext:editorSelectionEndLine` : the end line of the selection as a string
* `extraContext:editorSelectionEndCharacter` : the end character of the selection as a string
* `extraContext:editorSelectionHasMultipleLines` : boolean that is true if the selection spans multiple lines
* `extraContext:editorSelectionStartVisible` : boolean that is true if the selection start is visible **(*)**
* `extraContext:editorSelectionStartLineRelativeVisibleTop` : number: selection start line relative to visible range top (0 is first visible line)
* `extraContext:editorSelectionStartLineRelativeVisibleBottom` : number: selection start line relative to visible range bottom (0 is last visible line)
* `extraContext:editorCursorNextChar` : string: the character after the **active** position (cursor) of the first selection. The empty string when the active position is at the end of a line.

# editorSelectionEndCharacter

If the editor contains a script for the current terminal and you want to send the current line or current selection to the terminal you can use these 3 key bindings.

All keybindings use the **same key combo**.

Using the `when` clause we make the selection which command is executed. They have to be defined in **this** order in `keybindings.json`:

The example uses the extension [Command Variable](https://marketplace.visualstudio.com/items?itemName=rioj7.command-variable#interminal).

```jsonc
  {
    "key": "ctrl+i f5",  // or any other combo
    "command": "extension.commandvariable.inTerminal",
    "args": {
      "command": "extension.commandvariable.transform",
      "args": { "text": "${selectedText}" },
      "addCR": true
    },
    "when": "editorTextFocus && editorHasSelection"
  },
  {
    "key": "ctrl+i f5",  // or any other combo
    "command": "extension.commandvariable.inTerminal",
    "args": {
      "command": "extension.commandvariable.transform",
      "args": { "text": "${selectedText}" },
    },
    "when": "editorTextFocus && editorHasSelection && extraContext:editorSelectionEndCharacter == '1'"
  },
  {
    "key": "ctrl+i f5",  // or any other combo
    "command": "extension.commandvariable.inTerminal",
    "args": {
      "command": "extension.commandvariable.currentLineText",
      "addCR": true
    },
    "when": "editorTextFocus && !editorHasSelection"
  }
```

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

``` jsonc
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

# editorCursorNextChar

You can select different commands for a key binding based on the character to the right of the **active** position (cursor) of the first selection.

If you do not want to insert a tab, or insert spaces to the next tab stop, when the cursor is before a `]` character use:

```json
  {
    "key": "tab",
    "command": "cursorRight",
    "when": "editorTextFocus && extraContext:editorCursorNextChar == ']'"
  }
```

# Actual name used in `setVariable` and `toggleVariable`

The actual context variable name used is <code>extraContext:<em>name</em></code>. This ensures the name is unique in VSCode. You can't change the value of existing context variables because they are set by other part of VSCode. This is the name to use in `when` clauses for key bindings, menu options, ....

Together with a few commands from [Select By](https://marketplace.visualstudio.com/items?itemName=rioj7.select-by) you can setup a Multi Cursor Placement by keyboard.

``` json
  {
    "key": "ctrl+alt+right",
    "when": "editorTextFocus && extraContext:multiCursorByKeyboard",
    "command": "selectby.addNewSelection",
    "args": {"offset": 1}
  },
  {
    "key": "shift+right",
    "when": "editorTextFocus && extraContext:multiCursorByKeyboard",
    "command": "selectby.moveLastSelectionActive",
    "args": {"offset": 1}
  },
  {
    "key": "shift+left",
    "when": "editorTextFocus && extraContext:multiCursorByKeyboard",
    "command": "selectby.moveLastSelectionActive",
    "args": {"offset": -1}
  },
  {
    "key": "right",
    "when": "editorTextFocus && extraContext:multiCursorByKeyboard",
    "command": "selectby.moveLastSelection",
    "args": {"offset": 1}
  },
  {
    "key": "left",
    "when": "editorTextFocus && extraContext:multiCursorByKeyboard",
    "command": "selectby.moveLastSelection",
    "args": {"offset": -1}
  }
```

# Set a context variable

With the command **Extra Context: Set a context variable to a value** (`extra-context.setVariable`) you can set a user defined context variable. The command has an object as argument with the following properties:

* `name` : The name of the property to set
* `value` : The value to set the property

If the command argument is not defined or the command is called from the Command Palette you are presented with a QuickPick list to choose a predefined option. The predefined options are taken from the `extra-context.setVariables` setting. The `name` and `value` defined in the picked item are used.

# Toggle a context variable

With the command **Extra Context: Toggle a context variable true/false value** (`extra-context.toggleVariable`) you can toggle the boolean value of a context variable. The command has an object as argument with the following property:

* `name` : The name of the property to toggle

If the command argument is not defined or the command is called from the Command Palette you are presented with a QuickPick list to choose a predefined variable. The predefined options are taken from the `extra-context.toggleVariables` setting. The `name` defined in the picked item is used.

VSC does not have a context variable that keeps track if everything is folded. With the following key bindings you can use the same key binding to fold/unfold everything.

```json
{
    "key": "ctrl+m",
    "when": "editorTextFocus && foldingEnabled && !extraContext:isFolded",
    "command": "extension.multiCommand.execute",
    "args": { 
        "sequence": [
            "editor.foldAll",
            { "command": "extra-context.toggleVariable",
              "args": { "name": "isFolded" }
            }
        ]
    }
},
{
    "key": "ctrl+m",
    "when": "editorTextFocus && foldingEnabled && extraContext:isFolded",
    "command": "extension.multiCommand.execute",
    "args": { 
        "sequence": [
            "editor.unfoldAll",
            { "command": "extra-context.toggleVariable",
              "args": { "name": "isFolded" }
            }
        ]
    }
}
```

# Settings

The extension has the following settings:

* `extra-context.toggleVariables` : Array of `QuickPickItem`s with `name` property of context variables we can toggle
* `extra-context.setVariables` : Array of `QuickPickItem`s with `name` and `value` properties of context variables we can set

A [`QuickPickItem`](https://code.visualstudio.com/api/references/vscode-api#QuickPickItem) is an object with the properties described in the VSCode API documentation. You can use the `label`, `detail` and `description` properties to show a more user friendly item in the pick list. If `label` is the same as `name` you don't have to mention `name`.

An example:

``` json
  "extra-context.toggleVariables": [
    {"name": "multiCursorByKeyboard", "label":"Multi Cursor by Keyboard"}
  ],
  "extra-context.setVariables": [
    {
      "name": "multiCursorByKeyboard", "value": true,
      "label":"Multi Cursor by Keyboard", "description": ": On"
    },
    {
      "name": "multiCursorByKeyboard", "value": false,
      "label":"Multi Cursor by Keyboard", "description": ": Off"
    },
    {
      "name": "line-threshold", "value": 3,
      "label":"Line threshold", "description": ": 3"
    }
  ]
```
