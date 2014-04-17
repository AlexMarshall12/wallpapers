var mongoose = require('mongoose');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var fs = require('fs');
var imageSchema = new mongoose.Schema({
	source: {type: String, required: true},
        score: {type: Number,
		required: true, 
    		default: 0
		} 
});

var images_in_folder = fs.readdirSync(appDir + "/public/images");


module.exports.imageSchema = imageSchema;
mongoose.model('Image', imageSchema);
