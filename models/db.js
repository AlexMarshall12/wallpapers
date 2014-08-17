var mongoose = require('mongoose');
var imageSchema = new mongoose.Schema({
	source: {type: String, required: true},
        score: {type: Number,
		required: true, 
    		default: 0
		} 
});

mongoose.model('Image', imageSchema);
module.exports.imageSchema = imageSchema;

