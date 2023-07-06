const vscode = require('vscode');

const getProperty = (obj, prop, deflt) => { return obj.hasOwnProperty(prop) ? obj[prop] : deflt; };

let variableCopy = {};

function setContext(name, value) {
  vscode.commands.executeCommand('setContext', `extraContext:${name}`, value);
  variableCopy[name] = value;
}

async function getQuickPickNameValue(configName, args) {
  if (args === undefined) { args = {}; }
  let name = getProperty(args, 'name');
  let value = getProperty(args, 'value');
  if (name === undefined) {
    let qpItems = vscode.workspace.getConfiguration('extra-context', null).get(configName);
    if (qpItems.length === 0) {
      vscode.window.showErrorMessage(`List of context variables is empty. (setting: extra-context.${configName})`);
    } else {
      name = undefined;
      let qpItem = await vscode.window.showQuickPick(qpItems, {title: `Pick a variable to ${configName.replace('Variables', '')}`});
      if (qpItem !== undefined) {
        name = getProperty(qpItem, 'name');
        if (name === undefined) {
          name = getProperty(qpItem, 'label');
        }
        value = getProperty(qpItem, 'value');
      }
    }
  }
  return [name, value];
}

/** @param {vscode.TextEditor} editor @param {vscode.Position} pos */
function getCharAtPosition(editor, pos, offset = 0) {
  let character = pos.character + offset;
  if (character < 0) { return ''; }
  return editor.document.lineAt(pos.line).text.substring(character, character+1);
}

function activate(context) {
  function editorExtraContextAll(editor) {
    editorExtraContextSelection(editor);
    editorExtraContextVisibleRange(editor);
  }
  /** @param {vscode.TextEditor} editor */
  function editorExtraContextSelection(editor) {
    if (editor === undefined) { return; }
    vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartLine', String(editor.selection.start.line+1));
    vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartCharacter', String(editor.selection.start.character+1));
    vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionEndLine', String(editor.selection.end.line+1));
    vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionEndCharacter', String(editor.selection.end.character+1));
    vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionHasMultipleLines', editor.selection.start.line !== editor.selection.end.line);
    vscode.commands.executeCommand('setContext', 'extraContext:editorCursorNextChar', getCharAtPosition(editor, editor.selection.active));
    vscode.commands.executeCommand('setContext', 'extraContext:editorCursorPreviousChar', getCharAtPosition(editor, editor.selection.active, -1));
    editorExtraContextVisibleRange(editor);
  }
  function editorExtraContextVisibleRange(editor) {
    if (editor === undefined) { return; }
    if (editor.visibleRanges.length === 1) {
      let visibleRange = editor.visibleRanges[0];
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartVisible', visibleRange.contains(editor.selection.start));
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartLineRelativeVisibleTop', editor.selection.start.line - visibleRange.start.line);
      vscode.commands.executeCommand('setContext', 'extraContext:editorSelectionStartLineRelativeVisibleBottom', visibleRange.end.line - editor.selection.start.line);
    }
  }
  vscode.window.onDidChangeTextEditorSelection( changeEvent => { editorExtraContextSelection(changeEvent.textEditor); }, null, context.subscriptions);
  vscode.window.onDidChangeActiveTextEditor( editor => { editorExtraContextAll(editor); }, null, context.subscriptions);
  vscode.window.onDidChangeTextEditorVisibleRanges( changeEvent => { editorExtraContextVisibleRange(changeEvent.textEditor); }, null, context.subscriptions);
  editorExtraContextAll(vscode.window.activeTextEditor);
  context.subscriptions.push(vscode.commands.registerCommand('extra-context.setVariable', async args => {
    let [name, value] = await getQuickPickNameValue('setVariables', args);
      if (name === undefined || value === undefined) { return; }
      setContext(name, value);
  }));
  context.subscriptions.push(vscode.commands.registerCommand('extra-context.toggleVariable', async args => {
    let [name, _] = await getQuickPickNameValue('toggleVariables', args);
    if (name === undefined) { return; }
    let value = !getProperty(variableCopy, name, false);
    setContext(name, value);
  }));
};

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
