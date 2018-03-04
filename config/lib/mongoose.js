var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Connecting to the database
/**mongoose.connection('mongodb://localhost:27017/masterpass', function (err) {
    if (err){
        return callback(err); //returning an internal error status
    }

    console.log('success'); //return success if there is no error
});**/

//Creating a new schema for users
var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

//Telling mongoose what collection in my database to use - Users collection
var User = mongoose.model('Users', UserSchema);

//Creating a new User
var sheena = new User({
    username: 'Sheena Kelly',
    password: 'sheena123'
});

console.log(sheena);


