
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var imagedb = require('./models/db');
var mongoose = require('mongoose');
var fs = require('fs');
var app = express();
var logfmt=require('logfmt');
var util = require('util');
var uristring= "mongodb://heroku_app24230415:l91npmc6qlrdole3ptlq0s8not@ds045157.mongolab.com:45157/heroku_app24230415";
//var uristring= 'mongodb://'+process.env.MONGOLAB_URI+'/images';
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
app.set('port', process.env.PORT || 3001);
app.use(express.static(__dirname + '/public'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', function(req,res){
	res.render('index');
});
app.get('/data', getImages);
app.get('/about', function(req,res){res.render('about')});
//app.post('/data', vote_and_view);
app.get('/data/:image_id', function(req,res){
	id = req.url.slice(6,30);
	console.log(id);
	Image.findById(id,function(err,data){
		if(err){
			console.log(err);
		}
		else{
		res.json(data);}
	});
});


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
	var numPages = 16;
	var page = (req.param('page') === undefined)? 1:req.param('page');
	console.log(page);
	var perPage=12;
	var return_array=[];
	var image_ids=[];
	var number_images=185;
	//console.log(req.cookies);
	Image.find({}, function(err,images){
		if (err) {
			console.log('error');
		} else {
			for (var i=0;i<number_images;i++) { 
				return_array.push(images[i]);
			};
			res.json(return_array);
		}
		});
}
	/*Image.find({}, function(err,images){
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
				res.json(return_array);
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
				res.json(return_array);
			}
		}
	});
});
*/

			/*
function vote_and_view(req,res){
	var id=req.url.slice(6,30);
	var id_array = JSON.parse(req.body.image_ids);
	if (id.match(/^[0-9a-fA-F]{24}$/)){
		Image.findById(id,function(err,image){
			if(err)
			console.log(err);
			else {
				console.log(image);
				adjust(image.score);
				res.render('viewImage',{chosen:image.source,score:image.score,id_array:id_array[1]});
			};
		});
	}

	else {
		console.log('ddjkdl');
	}
	function adjust(winner_score){
		var K=1;
		var winner_index = id_array.indexOf(id);
		if (winner_index > -1){
			id_array.splice(winner_index,1);
		}
		adjustment_values=[];
		old_values=[];
		for (var i =0;i<id_array.length;i++){
			Image.findById(id_array[i], function(err, loser){
				loser_expected_value=1/(1+10)^((winner_score-loser.score)/2);
				adjustment_values.push(1/((1+10)^((loser.score-winner_score)/2)));
				console.log(1/Math.pow(1+10,(loser.score-winner_score)/2));
				loser_corr = Math.exp(-Math.pow(loser.score-5,2)/3);
				loser.score=loser.score-K*(loser_expected_value);
				loser.save();
			});
			
			winner_corr=Math.exp(-Math.pow(winner_score-5,2)/3);
			var winner_adjust = adjustment_values.reduce(function(x,y){return x+K*(1-y)},0);
			console.log('winner_adjust:'+winner_adjust)
			console.log(adjustment_values);
			Image.findByIdAndUpdate(id, {$inc: {score: winner_adjust}},function(err,winner){
				if(err) console.log('error errorrrrr')
				else {console.log(winner)}
			});

		}
	}
}

			*/
http.createServer(app).listen(app.get('port'), function( req, res){
	console.log('Express server listening on port ' + app.get('port'));
});
