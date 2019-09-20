
import * as vscode from 'vscode';

function evaluate(input: string, radix: string, n: number, proca_path: string, python_path: string)
{
    const cp = require('child_process');
    input = input.replace(/\bn\b/g, n.toString());
    let result = cp.execFileSync(python_path, [proca_path, radix, input]);
    return result.toString();
}

function process(radix: string, proca_path: string)
{
    let editor = vscode.window.activeTextEditor;
    let python_path = vscode.workspace.getConfiguration('python').get('pythonPath', 'python');
    if (editor)
    {
        const selections: vscode.Selection[] = editor.selections;
        const document: vscode.TextDocument = editor.document;
        editor.edit(
            function (builder)
            {
                let n = 0;
                for (const selection of selections)
                {
                    let expression = document.getText(selection);
                    let result = evaluate(expression, radix, n, proca_path, python_path);
                    n += 1;
                    builder.replace(selection, result);
                }
            }
        );
    }
}

export function activate(context: vscode.ExtensionContext)
{
    const path = require("path");
    let proca_path = path.join(context.extensionPath, "src", "proca.py");

    context.subscriptions.push(
        vscode.commands.registerCommand(
            'procapy.calculate.decimal', () => {process("decimal", proca_path);}
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'procapy.calculate.hex', () => {process("hex", proca_path);}
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'procapy.calculate.binary', () => {process("binary", proca_path);}
        )
    );
    context.subscriptions.push(
        vscode.commands.registerCommand(
            'procapy.calculate.octal', () => {process("octal", proca_path);}
        )
    );
}

export function deactivate() {}
