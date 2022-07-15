import snykParser from "./Parser";
import * as vscode from "vscode";

const showInfoDialog = (msg: string) => {
  vscode.window.showInformationMessage(msg);
};

const showWarnDialog = (msg: string) => {
  vscode.window.showWarningMessage(msg);
};

const getNpmDeps = async (data: string) => {
  let deps = JSON.parse(data)["dependencies"];
  let depLen = Object.keys(deps).length;
  let count = 1;
  showInfoDialog(`Scanning ${depLen} Javascript libraries`);
  for (const [key, val] of Object.entries(deps)) {
    const version = val.match(/(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+)\.\d+)/)[0];
    const url = `https://snyk.io/vuln/npm:${key}@${version}`;

    const vulns = await snykParser(url);
    deps[key] = { url, vulns, version };
    if (count === depLen) {
      return deps;
    }
    count += 1;
  }
  // jquery:1.12.4
};

const getPomDeps = (data: string) => {
  const deps = JSON.parse(data)["dependencies"];
};

const getGoDeps = async (data: string) => {
  let deps: any = {};
  for (let line of data.split("\n")) {
    let val = line.split(" ");
    let key = val[0].trim();
    let version = val[1]
      .trim()
      .match(/(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+)\.\d+)/)[0];
    deps[key] = version;
  }
  let depLen = Object.keys(deps).length;
  let count = 1;
  showInfoDialog(`Scanning ${depLen} Golang libraries`);

  for (const [key, version] of Object.entries(deps)) {
    const url = `https://snyk.io/vuln/golang:${key.replaceAll(
      "/",
      "%2F"
    )}@${version}`;

    const vulns = await snykParser(url);
    deps[key] = { url, vulns, version };
    if (count === depLen) {
      return deps;
    }
    count += 1;
  }
  // github.com/kubeedge/kubeedge/cloud/pkg/router/listener@1.10.1
};

const getPyDeps = (data: string) => {
  console.log(data);
};

const analyzeDeps = (ext: any, fileData: string) => {
  console.log("Hey ! I'm analysing the dependencies");
  if (ext.endsWith(".json")) {
    console.log("Javascript project found");
    showWarnDialog("Javascript project found");
    return getNpmDeps(fileData);
  } else if (ext.endsWith(".pom")) {
    console.log("Maven project found");
    getPomDeps(fileData);
  } else if (ext.endsWith(".sum")) {
    console.log("Go project found");
    showWarnDialog("Go project found");
    return getGoDeps(fileData);
  } else if (ext.endsWith(".py")) {
    console.log("Python project found");
    getPyDeps(fileData);
  }
};

export default analyzeDeps;
