
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var imagedb = require('./models/db');
var mongoose = require('mongoose');
var fs = require('fs');
var app = express();
var logfmt=require('logfmt');
var util = require('util');
//var uristring= "mongodb://localhost:27017/images" || 'mongodb://'+process.env.MONGOLAB_URI+'/images';
var uristring= 'mongodb://'+process.env.MONGOLAB_URI+'/images';
var theport = process.env.PORT  || 5000;
var appDir = path.dirname(require.main.filename);
mongoose.connect(uristring,{ server: { socketOptions: { connectTimeoutMS: 1000 }}}, function(err,res){
	if (err) {
		console.log('ERROR connecting to: '+uristring+'. ' + err)
	}
	else {
		console.log('Succeeded connected to: '+uristring);
	}
});
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Database connection error, fcukkk:'));
conn.once('open', function callback() {console.log("sup stud, Database connected.")});
var Image = conn.model("Image", imagedb.imageSchema); 


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', getImages);
app.get('/users', user.list);
app.get('/about', function(req,res){res.render('about')});
app.post('/view/:id', vote_and_view); 

function shuffled_array(array_length){
  var currentIndex=array_length
	  ,temporaryValue
	  ,randomIndex
	  ;
  var temp_array=[];
  for (var i=0;i<array_length;i++){
	  temp_array.push(i)
  }
  while (0 !==currentIndex){
	  randomIndex=Math.floor(Math.random()*currentIndex);
	  currentIndex -=1;
	  temporaryValue=temp_array[currentIndex];
	  temp_array[currentIndex]=temp_array[randomIndex];
	  temp_array[randomIndex]=temporaryValue;
  }

  return temp_array;
}

function getImages(req,res){
	var numPages = 4;
	var page = Math.max(req.param('page')-1,0);
	var perPage=12;
	Image.find({}).skip(page*perPage).limit(perPage).exec(function(err,images){
		if (err)
			console.log('fuck this');
		else {
			console.log(images);
			res.render('index',{images:images,numPages:numPages});
		}
	});
}

/*
function getImages(req,res){
  return_array=[];
  Image.find({},{__v:0,score:0},function(err,images){
    if (err)
	  console.err(err);
    else {
	  rand_array=shuffled_array(images.length);
	  for (var i=0;i<12;i++){
		  var max=44;
		  var min=0;
		  var randInt=Math.floor(Math.random()*(max-min+1))+min;
		  return_array.push(images[randInt]);
	  }
	  console.log(images);  
	  res.render('index', {images: return_array});  
    };
  }
);
};
*/

function vote_and_view(req,res){
  var id=req.url.slice(6,30);
  console.log(id);
  if (id.match(/^[0-9a-fA-F]{24}$/)){
	  Image.findById(id,function(err,image){
		  if(err)
		    	console.log(err);
	          else {
			  console.log(image);
			  res.render('viewImage',{chosen:image.source});
		  };
	  })
  }
  else{
	  console.log('ddjkdl');
  }
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
