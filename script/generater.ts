import {
    XMLParser,
    XMLBuilder,
    XmlBuilderOptionsOptional,
    X2jOptionsOptional,
} from 'fast-xml-parser';
import * as fs from 'fs';
import * as path from 'path';

export function generate(filePath: string) {
    const parseOptions = {
        ignoreAttributes: false,
        attributeNamePrefix: '',
    };
    const parser = new XMLParser(parseOptions);
    const obj = parser.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
    const buildOptions = {
        ignoreAttributes: false,
    };
    obj.ishelp.topic?.forEach((element) => {
        // Extract constants description to json file
        if (element.title === 'Constants') {
            let constantsMap = new Map<string, string>();
            const mergeMap = (
                map1: Map<string, string>,
                map2: Map<string, string>,
            ) => {
                return new Map([...map1.entries(), ...map2.entries()]);
            };
            element.body.dl.forEach((el) => {
                constantsMap = mergeMap(
                    extractConstants(el, buildOptions),
                    constantsMap,
                );
            });
            writeToFile('constant.json', constantsMap);
        }
    });
}

function writeToFile(fileName: string, value: Map<string, string>) {
    const strings = JSON.stringify(Object.fromEntries(value));
    fs.writeFile(path.join(__dirname, fileName), strings, (error) => {
        if (error) {
            console.error(error.message);
        }
    });
}

function extractConstants(
    content: any,
    buildOptions: XmlBuilderOptionsOptional,
) {
    const constantsDescription = new Map<string, string>();
    const len = content.dd.length;
    for (let i = 0; i < len; i++) {
        const xmlDescription = content.dd[i];
        const builder = new XMLBuilder(buildOptions);
        const description = builder.build(xmlDescription);
        try {
            const value = content.dt[i].b;
            if (Array.isArray(value)) {
                value.forEach((el) => {
                    if (el.a?.name && description) {
                        constantsDescription.set(el.a.name, description);
                    }
                });
                continue;
            }
            if (value.a.name && description) {
                constantsDescription.set(value.a.name, description);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return constantsDescription;
}

function test() {
    const string = '<p>The application directory, which the user selects on the <i>Select Destination Location</i> page of the wizard.<br/>For example: If you used <tt>{app}\MYPROG.EXE</tt> on an entry and the user selected "C:\MYPROG" as the application directory, Setup will translate it to "C:\MYPROG\MYPROG.EXE".</p>';

    const parseOptions = {
        ignoreAttributes: false,
        preserveOrder: true
        
    };
    const parser = new XMLParser(parseOptions);
    const obj = parser.parse(string);
    const builder = new XMLBuilder(parseOptions);
    const str = builder.build(obj);
    console.log(str);
}
test();
// TODO: Automatically download isetup.xml file from https://github.com/jrsoftware/issrc/blob/main/ISHelp/isetup.xml
generate(path.join(__dirname, '../isetup.xml'));
