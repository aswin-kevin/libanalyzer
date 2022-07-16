# libanalyzer

Lib Analyzer is a VScode extension written in javascript. It is used to detect _vulnerable libraries_ in your project.

## Language support

Libanalyzer supports,

- NPM project (Javascript)
- Maven project (Java)
- Go project (Golang)

## Requirement

To scan using libanalyzer you should have any one of the following dependencies file,

- _go.mod_ or _go.sum_ file if your project is golang
- _pom.xml_ file if your project is java
- _packages.json_ file if your project is javascript

## Running

Once the extension is installed open any of your project (go or js or java)

- Open the respective dependency file _.mod or .sum or .json or .xml_
- Press `ctrl+shift+P` if you are in windows
- Press `cmd+shift+P` if you are in mac
- In the top search bar type `Run libanalyzer`
- Hit `enter` and that's it scan started

## Steps

1. Open up a dependency file

![Opening a dependency file](images/vs1.png)

2. Search and run the command

![Running libanalyzer](images/vs2.png)

### For more information

- Contact me [Hackwithash](https://www.hackwithash.com)
- Follow me on [Linkedin](https://www.linkedin.com/in/aswin-venkat-ceo/)

**Enjoy!**
