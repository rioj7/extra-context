const vscode = require('vscode');

function activate(context) {
  vscode.window.onDidChangeTextEditorSelection(
    (changeEvent) => {
      let editor = changeEvent.textEditor;
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartLine', String(editor.selection.start.line+1));
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionEndLine', String(editor.selection.end.line+1));
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionHasMultipleLines', editor.selection.start.line !== editor.selection.end.line);
    },
    null, context.subscriptions);
};

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
