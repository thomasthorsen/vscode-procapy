
import * as vscode from 'vscode';

function evaluate(input: string, radix: string, n: number, proca_path: string, python_path: string)
{
    const cp = require('child_process');
    input = input.replace(/\bn\b/g, n.toString());
    let result = cp.execFileSync(python_path, [proca_path, radix, input]);
    return result.toString();
}

function get_python_path()
{
    const cp = require('child_process');
    var python_paths: string[] = ['python3', 'python'];
    let python_configured_path = vscode.workspace.getConfiguration('python', null).get('pythonPath');
    if (typeof python_configured_path === "string")
    {
        python_paths.unshift(python_configured_path);
    }
    for (var python_path of python_paths)
    {
        try
        {
            cp.execFileSync(python_path, ['--version']);
            return python_path;
        }
        catch (e) {}
    }
    vscode.window.showErrorMessage(
        'Python executable not found, make sure "python3" or "python" is in the path, ' +
        'or install the Python extension to define a custom location of python.');
    return '';
}

function process(radix: string, proca_path: string)
{
    let editor = vscode.window.activeTextEditor;
    let python_path = get_python_path();

    if (editor && python_path !== '')
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
