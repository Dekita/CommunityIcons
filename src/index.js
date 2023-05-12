// 
// author: dekitarpg@gmail.com <3
// system: create custom data table for hogwarts legacy icons :)
// 

const stringify = require("json-stringify-pretty-compact");
const {join, dirname, basename, extname} = require('path');
const {writeFile, lstat} = require('fs').promises;
const LOG = {default: false, custom: true};
const utils = require('./utils');

// actual logic
(async() =>  {

    console.log(`Generating new UI_DT_Icons.json file`);

    // path for json file containing all default icons
    const input_json = require("./UI_DT_Icons.json")[0];
    const output_file = join(__dirname, '../output/UI_DT_Icons.json');
    const file_dir = join(__dirname, '../customicons/json'); 
    let output = []; // output array saved as json

    // add all default icons
    for (const key of Object.keys(input_json.Rows)) {
        const objekt = {...input_json.Rows[key]};
        for (const key of Object.keys(objekt)) {
            if (objekt[key].AssetPathName !== undefined) {
                objekt[key] = objekt[key].AssetPathName;
            }
        }
        output.push({Name: key, ...objekt});
        if (LOG.default) console.log(`Added Default Icon: ${key}`);
    }

    // add all custom icons
    for await (const readpath of utils.getFiles(file_dir)) {
        const filepath = readpath.replace(file_dir, '');
        const filename = basename(filepath, extname(filepath));
        // remove elements if they already exist
        output = output.filter(e => !["None", filename].includes(e.Name));
        // add new elements
        output.push({...require(readpath), Name: filename});
        if (LOG.custom) console.log(`Added Custom Icon: ${filename}`);
    }

    // write the final file <3
    await writeFile(output_file, stringify(output, {
        maxLength: 108, indent: 4
    }));

})();