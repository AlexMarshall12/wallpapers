var fs=require('fs');
var path = require('path');

var images_in_folder = fs.readdirSync("~/python/");
images_in_folder.forEach(insert_image);
  
function insert_image(element, index){
	  new Image({source: element,score:0}).save(function(err, image_instance){if (err) return console.error(err); });
}

             
             
             
             
             
             
             



































