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
    compact: true
};

describe("xml to json", ()=>{
    it("returns get response json", async ()=> {
            const [err, xmlString] = await getXmlString('./get.xml');
            if (err) {
                throw err
            }
            
            const getObj = JSON.parse(xml2json(xmlString, options))
            let contents = getObj;
            console.log(contents)
    })
    it("returns list response json", async ()=> {
            const [err, xmlString] = await getXmlString('./list.xml');
            if (err) {
                throw err
            }
            
            const listObj = JSON.parse(xml2json(xmlString, options))
            let contents = listObj.ListBucketResult.Contents;
            if (!Array.isArray(contents)){
                contents = [contents]
            }

            console.log(contents)
            expect(contents[0].Key._text === "test")
    })
})
