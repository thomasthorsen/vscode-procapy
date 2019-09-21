
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
    let python_path = vscode.workspace.getConfiguration('python', null).get('pythonPath', 'python');

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
                    if (!selection.isEmpty)
                    {
                        let expression = document.getText(selection).trim();
                        if (expression.length > 0)
                        {
                            let result = evaluate(expression, radix, n, proca_path, python_path);
                            builder.replace(selection, result);
                        }
                    }
                    else
                    {
                        let line = document.lineAt(selection.active.line);
                        if (!line.isEmptyOrWhitespace)
                        {
                            let result = evaluate(line.text, radix, n, proca_path, python_path);
                            builder.insert(line.range.end, '\n' + result);
                        }
                    }
                    n += 1;
                }
            }
        );
    }
}

export function activate(context: vscode.ExtensionContext)
{
    const path = require("path");
    let proca_path = path.join(context.extensionPath, "proca.py");

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
