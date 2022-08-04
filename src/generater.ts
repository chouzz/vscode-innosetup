import { XMLParser,XMLBuilder } from 'fast-xml-parser';
import * as fs from 'fs';

export function generate() {
    const options = {
        ignoreAttributes : false
    };
    const parser = new XMLParser(options);
    const obj = parser.parse(
        fs.readFileSync('D:/src/issrc/ISHelp/isetup.xml', { encoding: 'utf8' })
    );
    obj.ishelp.topic.forEach(element => {
        // match section group
        if(element['@_title'].match(/\[\w+\] section/g)){
            console.log(element.body);
            const options = {
                ignoreAttributes : true
            };
            const builder = new XMLBuilder(options);
            const xmlContent  = builder.build(element.body);
            console.log(xmlContent);
        }
        // match constant group
     
    });
    console.log(obj);
}
