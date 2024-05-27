
// I worked on this code as part of a coding bootcamp curriculum. I followed along with the instructions 
// (i.e. followed/copied instructions from the course/instructors and didn't design everything from scratch myself) while
//  writing code in this project/file. Moreover, I  acknowledge receiving support from and/or working/collaborating
//   with instructors/classmates, generally as is expected from being a participant in the coding bootcamp.


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const currency = mongoose.Types.Currency;


const promotionSchema = new Schema(
    
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
        cost: {
            type: currency,
            required: true
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


const Promotion = mongoose.model("promotion", promotionSchema);

module.exports = Promotion;