// 
// This file will convert all icons within the converter/icons folder to the
// correct format for the game. It will also generate the json files for the
// icons., so that when running the prepare-for-hl script, the icons will be
// added to the data table automatically.
//

const { join, dirname, basename, extname } = require("path");
const utils = require("./utils");
const sharp = require("sharp");
const stringify = require("json-stringify-pretty-compact");
const { writeFile, lstat } = require("fs").promises;

// actual logic
(async () => {
    
    // ::
    // :: configurations
    // ::
    const ICON_SIZE = 256;
    const ICON_BLUR = 2;
    
    
    // ::
    // :: actual code
    // ::
    
    console.log(`Converting icons...`);
    const input_files_path = join(__dirname, "../converter/icons/");
    const overlay_file = join(__dirname, "../converter/overlay-angled.png");



    function capitalizeEachWordFirstLetter(str) {
        return str.toLowerCase().replace( /\b./g, (a) => a.toUpperCase());
    }
    
    async function processImage(bg, input_file, output_name, blend = 'atop') {
        // const output_file = join(__dirname, "../customicons/icon/AutoIcon", output_name);
        const ue_filename = `UI_T_AutoIcon_${output_name}_${blend.toUpperCase()}`.replace(/-/g, "_");
        const output_file = join(__dirname, `../customicons/icon/AutoIcon/${ue_filename}.png`);


        const composite_opts = { input: overlay_file, tile: false, blend };
        const image = await sharp(input_file, { density: 300 })
            .resize(ICON_SIZE, ICON_SIZE)
            .composite([composite_opts])
            .png().toBuffer();
    
        await sharp({
            create: {
                width: ICON_SIZE,
                height: ICON_SIZE,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0.0 }
            }
        }).composite([
            // add bg layer multiple times to ensure border is darkened
            { input: bg, tile: false, blend: 'over' },
            { input: bg, tile: false, blend: 'over' },
            { input: bg, tile: false, blend: 'over' },
            { input: image, tile: false, blend: 'over' }
        ])
        .png()
        .toFile(output_file)
        .then(i=> console.info(output_file))
        .catch(console.error);

        const json_out = join(__dirname, "../customicons/json/AutoIcon", ue_filename);
        // write json file
        await writeFile(
            `${json_out}.json`,
            stringify({
                "Name": "REPLACED BY FILENAME",
                "Icon": `/Game/UI/CustomIcons/AutoIcon/${ue_filename}.${ue_filename}`,
                "Locked": false,
                "HAngle": 157.5,
                "VAngle": -11.25,
                "FieldOfView": 20.0,
                "Padding": 1.1,
                "LightHAngle": 0,
                "LightVAngle": 0,
                "CameraOffset": {"X": 0, "Y": 0, "Z": 0},
                "AnimSequence": "None",
                "AnimPercent": 0,
                "CopyIconInfoRowName": "None"
            }, {
              maxLength: 108,
              indent: 4,
            })
        );

    }
    // iterate over all files in input folder
    for await (const readpath of utils.getFiles(input_files_path)) {
        const filepath = readpath.replace(input_files_path, "");
        const filename = basename(filepath, extname(filepath));
        const base_out = capitalizeEachWordFirstLetter(filename);
        const bg = await sharp(readpath, { density: 300 })
            .blur(ICON_BLUR)
            .negate({ alpha: false })
            .resize(ICON_SIZE, ICON_SIZE)
            .png().toBuffer();
        await processImage(bg, readpath, base_out, 'atop');
        await processImage(bg, readpath, base_out, 'dest-in');
        await processImage(bg, readpath, base_out, 'in');
        // break; // handy for testin'
    }    

})();
  