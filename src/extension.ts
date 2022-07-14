import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("LibAnalyzer is started .. ");

  let disposable = vscode.commands.registerCommand(
    "libanalyzer.checkVulnerabilities",
    async () => {
      if (!vscode.window.activeTextEditor) {
        return vscode.window.showErrorMessage(
          "Please open a dependencies file first"
        );
      }

      const currentFile = vscode.window.activeTextEditor?.document.uri;
      console.log("This is our current file name :", currentFile);

      vscode.workspace.openTextDocument(currentFile).then((data) => {
        console.log(data.getText());
      });

      //   vscode.window.showWarningMessage(
      //     "Your project uses 4 vulnerable libraries"
      //   );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
