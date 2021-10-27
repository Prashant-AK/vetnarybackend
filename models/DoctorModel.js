var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
    fullName: {
		type: String,
		required: true
	},	
	email: {
		type: String,
		required: true,
		// unique: true
	},
    mobno:{
        type:Number,
        // required:true,
        // unique: true,
    },
    address: {
		type:String
		
	}

})


module.exports = mongoose.model("doctors", UserSchema);