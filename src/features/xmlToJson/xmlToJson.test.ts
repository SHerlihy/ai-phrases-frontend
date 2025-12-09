import { describe, expect, it } from 'vitest';
const fs = require('fs').promises;
import { xml2json } from "xml-js";

async function getXmlString(xmlFilePath: string): Promise<[undefined, string] | [Error]> {
    try{
    const xmlString = await fs.readFile(`${__dirname}/${xmlFilePath}`, 'utf8')
        return [undefined, xmlString]
    } catch (err) {
        return [err]
    }
}

const options = {
    // 1. Strip the XML declaration and attributes like xmlns
    compact: true,
    spaces: 4,
    // 2. Remove the XML namespace prefixes (like xmlns:s3)
    ignoreAttributes: true,
    // 3. Force the 'Contents' element into an array even if there is only one
    // This makes the iteration logic simpler and safer for future data
    elementNameFn: (name) => {
        if (name === 'Contents') {
            return 'ContentsArray';
        }
        return name;
    }
};

describe("xml to json", ()=>{
    it("returns get response json", async ()=> {
            const [err, xmlString] = await getXmlString('./get.xml');
            if (err) {
                throw err
            }
            
            const getJson = xml2json(xmlString)
    })
    it("returns list response json", async ()=> {
            const [err, xmlString] = await getXmlString('./list.xml');
            if (err) {
                throw err
            }
            
            const listObj = JSON.parse(xml2json(xmlString, options))
            let contents = listObj.ListBucketResult.ContentsArray;
            if (!Array.isArray(contents)){
                contents = [contents]
            }

            console.log(contents)
            expect(contents[0].Key._text === "test")
    })
})
