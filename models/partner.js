
// I worked on this code as part of a coding bootcamp curriculum. I followed along with the instructions 
// (i.e. followed/copied instructions from the course/instructors and didn't design everything from scratch myself) while
//  writing code in this project/file. Moreover, I  acknowledge receiving support from and/or working/collaborating
//   with instructors/classmates, generally as is expected from being a participant in the coding bootcamp.


const mongoose = require('mongoose');  // mongoose --> a wrapper / ODM (Object Data Model) library around mongo, for easier interfacing with the database 
const Schema = mongoose.Schema;


const partnerSchema = new Schema(
    
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
        },
        featured: {
            type: Boolean,
        },
        description: {
            type: String,
            required: true,
        },
    }, 
        {
            timestamps: true
        }

);


const Partner = mongoose.model("partner", partnerSchema);

module.exports = Partner;

