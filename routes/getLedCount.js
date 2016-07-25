var express = require('express');
var router = express.Router();
var mongo=require('mongodb');//Mongodb module src:https://www.mongodb.com/

 /**
 *Set Up Constants
 */
 var COLLECTION_NAME="userSockets";
 var MONGODB_URI=process.env.MONGODB_URI||"mongodb://localhost/mysticpants";

 /* Simple API method (/getLedCount) to intercept request for current LED count, 
 *retrieve current users LED config and display on page */
 router.get('/', function(req, res, next) {
 	mongo.connect(MONGODB_URI, function (err, db) {
 		if(err){
 			console.warn(err.message);
 		}else{
 			//Fnd the current user
 			var usersCollection = db.collection(COLLECTION_NAME);
 			usersCollection.findOne({},function(err,user){
 				if(err){
 					console.warn(err.message);
 				}else{
 					//case where no users exist means no user is connected so return -1
 					if(user===null||user.numLedActive===null){
 						res.end("-1"); 
 					}else{
 						//respond with current active led lights
 						res.end(user.numLedActive.toString());
 					}
 				}
 			});
 		}
 	});
 });

 module.exports = router;
