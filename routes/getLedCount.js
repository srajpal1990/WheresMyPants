var express = require('express');
var router = express.Router();
var mongo=require('mongodb');//Mongodb module src:https://www.mongodb.com/

 /**
 *Set Up Constants
 */
 var COLLECTION_NAME="userSockets";
 var MONGODB_URI=process.env.MONGODB_URI||"mongodb://localhost/mysticpants";

 /* GET home page. */
 router.get('/', function(req, res, next) {
 	mongo.connect(MONGODB_URI, function (err, db) {
 		if(err){
 			console.warn(err.message);
 		}else{
 			var usersCollection = db.collection(COLLECTION_NAME);
 			usersCollection.findOne({},function(err,user){

 				if(err){
 					console.warn(err.message);
 				}else{
 					console.log(user.numLedActive.toString());
 					res.end(user.numLedActive.toString());
 				}
 			});
 		}
 	});
 });

 module.exports = router;
