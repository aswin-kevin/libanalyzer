import snykParser from "./Parser";
import * as xml2js from "xml2js";
import * as vscode from "vscode";

const showInfoDialog = (msg: string) => {
  vscode.window.showInformationMessage(msg);
};

const getNpmDeps = async (data: string) => {
  let deps = JSON.parse(data)["dependencies"];
  let depLen = Object.keys(deps).length;
  let count = 1;
  showInfoDialog(`Found ${depLen} Javascript libraries`);
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

const getPomDeps = async (xml: string) => {
  let deps: any = {};
  var parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);
  const raw_deps = result.project.dependencies[0].dependency;
  for (const el of raw_deps) {
    const groupid = el.groupId[0];
    const artifactid = el.artifactId[0];
    const version = el.version[0];
    deps[`${groupid}:${artifactid}`] = version;
  }
  let depLen = Object.keys(deps).length;
  let count = 1;
  showInfoDialog(`Found ${depLen} Maven libraries`);

  for (const [key, version] of Object.entries(deps)) {
    const url = `https://snyk.io/vuln/maven:${key}@${version}`;

    const vulns = await snykParser(url);
    deps[key] = { url, vulns, version };
    if (count === depLen) {
      return deps;
    }
    count += 1;
  }
};
// groupid:artifact@version
// https://snyk.io/vuln/maven:junit:junit@4.8.2

const getGoDepsBySum = async (data: string) => {
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
  showInfoDialog(`Found ${depLen} Golang libraries`);

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

const getGoDepsByMod = async (data: string) => {
  let deps: any = {};
  for (let line of data.split("\n")) {
    if (line.includes("github.com")) {
      let val = line
        .split(" ")
        .map((le) => le.trim())
        .filter((el) => el.includes("github.com"));
      let version = line.trim().match(/(?:(\d+)\.)?(?:(\d+)\.)?(?:(\d+)\.\d+)/);
      if (version !== null) {
        let key = val[0].trim();
        deps[key] = version[0];
      }
    }
  }
  let depLen = Object.keys(deps).length;
  let count = 1;
  showInfoDialog(`Found ${depLen} Golang libraries`);

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

const getVulnDeps = (func: any, msg: string) => {
  return vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: `Scanning ${msg} libraries for vulns`,
    },
    async () => {
      return func;
    }
  );
};

const analyzeDeps = (ext: any, fileData: string) => {
  console.log("Hey ! I'm analysing the dependencies");
  if (ext.endsWith(".json")) {
    console.log("Javascript project found");
    return getVulnDeps(getNpmDeps(fileData), "Javascript");
  } else if (ext.endsWith(".xml")) {
    console.log("Maven project found");
    return getVulnDeps(getPomDeps(fileData), "Maven");
  } else if (ext.endsWith(".sum")) {
    console.log("Go project found");
    return getVulnDeps(getGoDepsBySum(fileData), "Golang");
  } else if (ext.endsWith(".mod")) {
    console.log("Go project found");
    return getVulnDeps(getGoDepsByMod(fileData), "Golang");
  }
};

export default analyzeDeps;
