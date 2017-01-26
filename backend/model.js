var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a user Schema
var UserSchema = new Schema({
  username:{type:String,required:true},
  // latitude:{type:Number,required:true},
  // longitude:{type:Number,required:true}
  location: {type: [Number], required: true} // [Long, Lat]
});
//Importantly, we’ve also established that the UserSchema should be indexed using a 2dsphere approach. This line is critical, because it allows MongoDB and Mongoose to run geospatial queries on our user data.
UserSchema.index({location:'2dsphere'});

// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: user
module.exports = mongoose.model('user',UserSchema);
