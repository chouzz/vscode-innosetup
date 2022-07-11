> This is a fork version of  [idleberg/vscode-innosetup](https://github.com/idleberg/vscode-innosetup)! Thanks @idleberg!

# Inno Setup for Visual Studio Code

[![The MIT License](https://flat.badgen.net/badge/license/MIT/orange)](http://opensource.org/licenses/MIT)
[![GitHub](https://flat.badgen.net/github/release/chouzz/vscode-innosetup)](https://github.com/chouzz/vscode-innosetup/releases)
[![Visual Studio Marketplace](https://vsmarketplacebadge.apphb.com/installs-short/chouzz.innosetup.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=chouzz.innosetup)
[![GithubActions](https://github.com/chouzz/vscode-innosetup/actions/workflows/CI.yaml/badge.svg)](https://github.com/chouzz/vscode-innosetup/actions/workflows/CI.yaml/badge.svg)

Language syntax, snippets and build system for Inno Setup

![Screenshot](https://raw.githubusercontent.com/chouzz/vscode-innosetup/master/images/screenshot.png)

*Screenshot of Inno Setup in Visual Studio Code with [Hopscotch](https://marketplace.visualstudio.com/items?itemName=idleberg.hopscotch) theme*

## Installation

### Extension Marketplace

Launch Quick Open, paste the following command, and press <kbd>Enter</kbd>

`ext install chouzz.innosetup`

### CLI

With [shell commands](https://code.visualstudio.com/docs/editor/command-line) installed, you can use the following command to install the extension:

`$ code --install-extension chouzz.innosetup`

### Packaged Extension

Download the packaged extension from the the [release page](https://github.com/chouzz/vscode-innosetup/releases) and install it from the command-line:

```bash
$ code --install-extension path/to/innosetup-*.vsix
```

Alternatively, you can download the packaged extension from the [Open VSX Registry](https://open-vsx.org/) or install it using the [`ovsx`](https://www.npmjs.com/package/ovsx) command-line tool:

```bash
$ ovsx get chouzz.innosetup
```

### Clone Repository

Change to your Visual Studio Code extensions directory:

```bash
# Windows
$ cd %USERPROFILE%\.vscode\extensions

# Linux & macOS
$ cd ~/.vscode/extensions/
```

Clone repository as `innosetup`:

```bash
$ git clone https://github.com/chouzz/vscode-innosetup innosetup
```
## Usage

### Building

Before you can build, make sure `ISCC` is in your PATH [environmental variable](https://support.microsoft.com/en-us/kb/310519). Alternatively, you can specify the path to `ISCC` in your [user settings](https://code.visualstudio.com/docs/customization/userandworkspace).

**Example:**

```json
"innosetup.pathToIscc": "full\\path\\to\\ISCC.exe"
```

*Note: If you're on non-Windows, you could specify the path to this [bash script](https://gist.github.com/derekstavis/8288379), which runs `ISCC` on Wine.*

To trigger a build, select *InnoSetup: Save & Compile”* from the [command-palette](https://code.visualstudio.com/docs/editor/codebasics#_command-palette) or use the default keyboard shortcut <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd>.

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
