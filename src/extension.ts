
import * as vscode from 'vscode';

function evaluate(input: string, n: number, proca_path: string)
{
	const cp = require('child_process');
	input = input.replace(/n/g, n.toString());
	let cmd = 'python "' + proca_path + '" "' + input + '"';
	let result = cp.execSync(cmd);
	return BigInt(result.toString());
}

export function activate(context: vscode.ExtensionContext)
{
	let disposable = vscode.commands.registerCommand('procapy.calculate.decimal', () =>
	{
		const path = require("path");
		let proca_path = path.join(context.extensionPath, "src", "proca.py");

		let editor = vscode.window.activeTextEditor;
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
						let result = evaluate(expression, n, proca_path);
						n += 1;
						builder.replace(selection, result.toString()); // TODO: format as hex/binary/octal/decimal
					}
				}
			);
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
