import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
interface Variable {
    value: string;
    description: string;
}
export interface LanguageContext {
    constants: Variable[]; // constant varibale and it's description
}
enum State {
    none,
    blockParsing,
}
const CONSTANT_WORD_REG = /<dt>.*(\{\w+\}).*<\/dt>/;
const CONSTANT_BLOCK_BEGIN = /^<dd>$/;
const CONSTANT_BLOCK_END = /^<\/dd>$/;


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
    constructor() {}

    public parse(str: string): LanguageContext {
        const lines = str.split('\n');
        const constantsVars: Variable[] = [];
        let state = State.none;
        for (let i = 0; i < lines.length; i++) {
            if (CONSTANT_BLOCK_BEGIN.test(lines[i])) {
                state = State.blockParsing;
                continue;
            } else if (CONSTANT_BLOCK_END.test(lines[i])) {
                state = State.none;
                continue;
            }
            if (state == State.blockParsing) {
                this._description += lines[i];
                continue;
            }
            if (this._value && this._description) {
                constantsVars.push({
                    value: this._value,
                    description: this._description,
                });
                this.clear();
            }
            const match = CONSTANT_WORD_REG.exec(lines[i]);
            if (match) {
                this.clear();
                this._value = match[1];
            }
        }
        if (this._value && this._description) {
            constantsVars.push({
                value: this._value,
                description: this._description,
            });
            this.clear();
        }
        constantsVars.push(...this.processAutoConstants());
        return {
            constants: constantsVars,
        };
    }

    private clear() {
        this._value = '';
        this._description = '';
    }

    private processAutoConstants(){
        const autoConstantsLists = ['{autoappdata}','{autocf}','{autocf32}','{autocf64}','{autodesktop}','{autodocs}','{autofonts}','{autopf}','{autopf32}','{autopf64}','{autoprograms}','{autostartmenu}','{autostartup}','{autotemplates}'];
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
        return autoConstantsLists.map(el => { return {value:el, description};});
    }
}
