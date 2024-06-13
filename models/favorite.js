
// I worked on this code as part of a coding bootcamp curriculum. I followed along with the instructions 
// (i.e. followed/copied instructions from the course/instructors and didn't design everything from scratch myself) while
//  writing code in this project/file. Moreover, I  acknowledge receiving support from and/or working/collaborating
//   with instructors/classmates, generally as is expected from being a participant in the coding bootcamp.


const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campsite"
    }]
});

favoriteSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Favorite', favoriteSchema);


