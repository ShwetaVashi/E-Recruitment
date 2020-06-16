var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Notification = new Schema({
    aid: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    postid: {type: mongoose.Schema.Types.ObjectId,ref: 'Post'},
   
    
});

module.exports = mongoose.model('Notification', Notification);