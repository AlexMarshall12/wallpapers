
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var imagedb = require('./models/db');
var cookieParser=require('cookie-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var app = express();
var logfmt=require('logfmt');
var util = require('util');
var cookieParser = require('cookie-parser');
var uristring= "mongodb://localhost:27017/images";
//var uristring= 'mongodb://'+process.env.MONGOLAB_URI+'/images';
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
app.use(cookieParser());
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

//function vote(id){
//	Image.findByIdAndUpdate(id,{$set: {score:10}})

function getImages(req,res){
	var numPages = 4;
	var page = (req.param('page') === undefined)? 1:req.param('page');
	console.log(page);
	var perPage=12;
	var return_array=[];
	var image_ids=[];
	var number_images=45;
	console.log(req.cookies);
	Image.find({}, function(err,images){
		if (err) {
			console.log('error');
		}
		else {
			if (req.cookies.ordering ==  undefined) {
				list_indexes=shuffled_array(number_images);
				for (var i=perPage*(page-1);i<perPage*page;i++){
					if(images[list_indexes[i]]){
						return_array.push(images[list_indexes[i]]);
						image_ids.push(images[i]._id);
					}
				}
				res.cookie('ordering',list_indexes);
				console.log('ordering not found');
				res.render('index',{images:return_array, image_ids:JSON.stringify(image_ids)})
			}
			else {
				var order_array = req.cookies.ordering;
				console.log('start');
				console.log(order_array);
				var start = perPage*(page-1);
				var end =perPage*page-1;
				console.log(start);
				console.log(end);
				for (var i=perPage*(page-1);i<perPage*page;i++){
					if(images[order_array[i]]){
						return_array.push(images[order_array[i]]);
						image_ids.push(images[i]._id);
					}
				}
				res.render('index',{images:return_array, image_ids:JSON.stringify(image_ids)});
			}
		}
	});
}

function vote_and_view(req,res){
	var id=req.url.slice(6,30);
	var id_array = JSON.parse(req.body.image_ids);
	if (id.match(/^[0-9a-fA-F]{24}$/)){
		Image.findById(id,function(err,image){
			if(err)
			console.log(err);
			else {
				console.log(image);
				res.render('viewImage',{chosen:image.source,score:image.score,id_array:id_array[1]});
			};
		});
	}

	else {
		console.log('ddjkdl');
	}
	for (var i =0;i<12;i++){
		Image.findByIdAndUpdate(id_array[i], {$inc: { score:8}}, function(err, image){
			console.log(image);
		});
	}
}

http.createServer(app).listen(app.get('port'), function( req, res){
	console.log('Express server listening on port ' + app.get('port'));
});
