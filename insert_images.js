var fs=require('fs');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect("mongodb://heroku_app24230415:l91npmc6qlrdole3ptlq0s8not@ds045157.mongolab.com:45157/heroku_app24230415");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('made contact');
});


var imageSchema = new mongoose.Schema({
        source: {type: String, required: true},
        score: {type: Number,
                required: true, 
                default: 0
                } 
});
var Image = mongoose.model('Image',imageSchema);
  

var file_list = fs.readdirSync(__dirname + '/public/wallpapers')
console.log(file_list);

file_list.forEach(insert_image)

	
function insert_image(element){
	//element = element.slice(6);
	console.log(element);
	new Image({source: element,score:5}).save(function(err, element){if (err) return console.error(err); });
}

             
             
             
             
             
             
             



































