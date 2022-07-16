import * as vscode from "vscode";
import analyzeDeps from "./components/Analyzer";

const writeToFile = (vulns: any) => {
  let content = "vulnerable-libraries.log\n\n";
  let isVuln = false;
  let count = 0;
  console.log("Data from main file", vulns);
  for (const vuln of Object.keys(vulns)) {
    if (vulns[vuln].vulns > 0) {
      count++;
      isVuln = true;
      content += `name - ${vuln}\nversion - ${vulns[vuln].version}\nno.of vulnerabilities - ${vulns[vuln].vulns}\nreference link - ${vulns[vuln].url}\n\n`;
    }
  }
  if (isVuln) {
    vscode.workspace
      .openTextDocument({ content: content })
      .then((doc) => {
        vscode.window.showTextDocument(doc, { preview: false });
      })
      .then(() => {
        vscode.window.showErrorMessage(
          `${count} vulnerable librarie(s) found in your project`
        );
      });
  } else {
    vscode.workspace
      .openTextDocument({
        content: content + "No vulnerable libraries found",
      })
      .then((doc) => {
        vscode.window.showTextDocument(doc, { preview: false });
      })
      .then(() => {
        vscode.window.showInformationMessage(
          `${count} vulnerable librarie(s) found in your project`
        );
      });
  }
};

export function activate(context: vscode.ExtensionContext) {
  console.log("LibAnalyzer is started .. ");

  let disposable = vscode.commands.registerCommand(
    "libanalyzer.checkVulnerabilities",
    async () => {
      // const lang = await vscode.window.showQuickPick(
      //   ["Javascript", "Maven", "Golang"],
      //   { placeHolder: "Select your project language to scan" }
      // );
      // vscode.window.showInformationMessage(
      //   `scanning ${lang} libraries using libanalyzer`
      // );

      if (!vscode.window.activeTextEditor) {
        return vscode.window.showErrorMessage(
          "Please open a dependencies file \nExample: packages.json or pom.xml or go.mod"
        );
      }
      const currentFile = vscode.window.activeTextEditor?.document.uri;
      vscode.workspace.openTextDocument(currentFile).then((fileData) => {
        let extenstion = vscode.window.activeTextEditor?.document.fileName;
        analyzeDeps(extenstion, fileData.getText())?.then((vulns) => {
          writeToFile(vulns);
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
