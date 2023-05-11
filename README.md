# HL Community Icon Table
A simple script to generate UI_DT_Icons.json for hogwarts legacy. 

## Why? 
Because only one mod can alter this resource, so it may as well be a community effort to define the data table for it <3

# Adding Custom Icons: 
Add your icons data using json within the /customicons/json folder, then add your textures to /customicons/icons. You should commit your changes to this main project so that it can be repackaged and updated periodically. 

# To Rebuild
run `yarn` to install node modules (requires yarn package manager + node.js).
run `yarn run start` to re-generate the data table. 
add icons from `customicons/icons` into the uproject at path `/Game/UI/CustomIcons`
add generated `output/UI_DT_Icons.json` to uproject (in correct path).
package mod containing custom data table.

# When Committing Your Icons
Make sure you dont overwrite any existing custom icons!!
Use as short a name as possible (to avoid long name errors) 

# Should I include UI_DT_Icons in my packaged mod?
No. As mentioned, only one single mod can alter this resource, so only one mod should be trying to. If needed, I can grant you access on nexus mod to upload a new version, just reach out: dekitrpg@gmail.com 

While still modding this game I'm happy to keep this mod up-to-date :)