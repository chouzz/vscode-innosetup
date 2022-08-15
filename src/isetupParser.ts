import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface Variable {
    value: string;
    description: string;
}

export interface LanguageContext {
    constants: Variable[]; // constant varibale and it's description
    directives: Variable[];
}

enum State {
    none,
    constantsParsing,
    directiveParsing,
}

const CONSTANTS_VALUE_REG = /<dt>.*(\{\w+\}).*<\/dt>/;
const DIRECTIVE_VALUE_REG = /<setuptopic directive="(\w+)">/;

const IGNORE_LABELS = [/<dd>/g, /<body>/g];

export function getLanguageContext(
    context: vscode.ExtensionContext,
): LanguageContext {
    const isetupFilePath = path.join(context.extensionPath, 'isetup.xml');
    const content = fs.readFileSync(isetupFilePath, { encoding: 'utf8' });
    const parser = new IsetupParser();
    return parser.parse(content);
}

export class IsetupParser {
    private _value = '';
    private _description = '';

    private _constantsVars: Variable[] = [];
    private _directiveVars: Variable[] = [];

    public parse(str: string): LanguageContext {
        const lines = str.split('\n');
        let lastState = State.none;
        for (let i = 0; i < lines.length; i++) {
            let state = this.checkState(lines[i]) || lastState;
            switch (state) {
                case State.constantsParsing:
                    state = this.processConstants(lines[i]);
                    break;
                case State.directiveParsing:
                    state = this.processDirective(lines[i]);
                    break;
                default:
                    break;
            }
            lastState = state;
        }

        this._constantsVars.push(...this.processAutoConstants());
        return {
            constants: this._constantsVars,
            directives: this._directiveVars,
        };
    }

    private processResult(): Variable {
        IGNORE_LABELS.forEach((el) => this._description.replace(el, ''));
        if (this._value && this._description) {
            return {
                value: this._value,
                description: this._description,
            };
        }
    }

    private processConstants(line: string) {
        const match = line.match(CONSTANTS_VALUE_REG);
        if (match) {
            this._value = match[1];
            return State.constantsParsing;
        } else if (/<\/dd>/.test(line)) {
            // match end of constants block
            const result = this.processResult();
            result && this._constantsVars.push(result);
            this.clear();
            return State.none;
        } else {
            this._description += line;
            return State.constantsParsing;
        }
    }

    private processDirective(line: string) {
        const match = line.match(DIRECTIVE_VALUE_REG);
        if (match) {
            this._value = match[1];
            return State.directiveParsing;
        } else if (/<\/body>/.test(line)) {
            // match end of directive block
            const result = this.processResult();
            result && this._directiveVars.push(result);
            this.clear();
            return State.none;
        } else {
            this._description += line;
            return State.directiveParsing;
        }
    }

    private checkState(line: string): State | undefined {
        if (line.match(CONSTANTS_VALUE_REG)) {
            return State.constantsParsing;
        } else if (line.match(DIRECTIVE_VALUE_REG)) {
            return State.directiveParsing;
        } else {
            return;
        }
    }

    private clear() {
        this._value = '';
        this._description = '';
    }

    private processAutoConstants() {
        const autoConstantsLists = [
            '{autoappdata}',
            '{autocf}',
            '{autocf32}',
            '{autocf64}',
            '{autodesktop}',
            '{autodocs}',
            '{autofonts}',
            '{autopf}',
            '{autopf32}',
            '{autopf64}',
            '{autoprograms}',
            '{autostartmenu}',
            '{autostartup}',
            '{autotemplates}',
        ];
        const description = `
<p>Besides the "common" and "user" constants, Inno Setup also supports "auto" constants. These automatically map to their "common" form unless the installation is running in <link topic="admininstallmode">non administrative install mode</link>, in which case they map to their "user" form.</p>
<p>It is recommended you always use these "auto" constants when possible to avoid mistakes.</p>
        
<indent>
<table>
<tr><td></td><td><u>Administrative</u></td><td><u>Non administrative</u></td></tr>
<tr><td><tt><a name="autoappdata">autoappdata</a></tt></td><td><tt>commonappdata</tt></td><td><tt>userappdata</tt></td></tr>
<tr><td><tt><a name="autocf">autocf</a></tt></td><td><tt>commoncf</tt></td><td><tt>usercf</tt></td></tr>
<tr><td><tt><a name="autocf32">autocf32</a></tt></td><td><tt>commoncf32</tt></td><td><tt>usercf</tt></td></tr>
<tr><td><tt><a name="autocf64">autocf64</a></tt></td><td><tt>commoncf64</tt></td><td><tt>usercf</tt></td></tr>
<tr><td><tt><a name="autodesktop">autodesktop</a></tt></td><td><tt>commondesktop</tt></td><td><tt>userdesktop</tt></td></tr>
<tr><td><tt><a name="autodocs">autodocs</a></tt></td><td><tt>commondocs</tt></td><td><tt>userdocs</tt></td></tr>
<tr><td><tt><a name="autofonts">autofonts</a></tt></td><td><tt>commonfonts</tt></td><td><tt>userfonts</tt></td></tr>
<tr><td><tt><a name="autopf">autopf</a></tt></td><td><tt>commonpf</tt></td><td><tt>userpf</tt></td></tr>
<tr><td><tt><a name="autopf32">autopf32</a></tt></td><td><tt>commonpf32</tt></td><td><tt>userpf</tt></td></tr>
<tr><td><tt><a name="autopf64">autopf64</a></tt></td><td><tt>commonpf64</tt></td><td><tt>userpf</tt></td></tr>
<tr><td><tt><a name="autoprograms">autoprograms</a></tt></td><td><tt>commonprograms</tt></td><td><tt>userprograms</tt></td></tr>
<tr><td><tt><a name="autostartmenu">autostartmenu</a></tt></td><td><tt>commonstartmenu</tt></td><td><tt>userstartmenu</tt></td></tr>
<tr><td><tt><a name="autostartup">autostartup</a></tt></td><td><tt>commonstartup</tt></td><td><tt>userstartup</tt></td></tr>
<tr><td><tt><a name="autotemplates">autotemplates</a></tt></td><td><tt>commontemplates</tt></td><td><tt>usertemplates</tt></td></tr>
</table>
</indent>`;
        return autoConstantsLists.map((el) => {
            return { value: el, description };
        });
    }
}
