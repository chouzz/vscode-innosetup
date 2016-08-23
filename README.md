# Inno Setup for Visual Studio Code

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/release/idleberg/vscode-innosetup.svg?style=flat-square)](https://github.com/idleberg/vscode-innosetup/releases)
[![Travis](https://img.shields.io/travis/idleberg/vscode-innosetup.svg?style=flat-square)](https://travis-ci.org/idleberg/vscode-innosetup)
[![David](https://img.shields.io/david/dev/idleberg/vscode-innosetup.svg?style=flat-square)](https://david-dm.org/idleberg/vscode-innosetup#info=devDependencies)

Language syntax, snippets and build system for Inno Setup

![Screenshot](https://raw.githubusercontent.com/idleberg/vscode-innosetup/master/images/screenshot.png)

*Screenshot of Inno Setup in Visual Studio Code with [Hopscotch](https://marketplace.visualstudio.com/items?itemName=gerane.Theme-Hopscotch) theme*

## Installation

### Extension Marketplace

Launch Quick Open, paste the following command, and press <kbd>Enter</kbd>

`ext install innosetup`

### GitHub

Change to your Visual Studio Code extensions directory:

```bash
# Windows
$ cd %USERPROFILE%\.vscode\extensions

# Linux & macOS
$ cd ~/.vscode/extensions/
```

Clone repository as `innosetup`:

```bash
$ git clone https://github.com/idleberg/vscode-innosetup innosetup
```
## Usage

### Building

Before you can build, make sure `ISCC` is in your PATH [environmental variable](https://support.microsoft.com/en-us/kb/310519). Alternatively, you can specify the path to `ISCC` in your [user settings](https://code.visualstudio.com/docs/customization/userandworkspace).

**Example:**

```json
"innosetup.pathToIscc": "full\\path\\to\\ISCC.exe"
```

*Note: If you're on non-Windows, you could specify the path to this [bash script](https://gist.github.com/derekstavis/8288379), which runs `ISCC` on Wine.*

To trigger a build, select *InnoSetup: Save & Compile”* from the [command-palette](https://code.visualstudio.com/docs/editor/codebasics#_command-palette) or use the default keyboard shortcut <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>.

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/vscode-innosetup) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`