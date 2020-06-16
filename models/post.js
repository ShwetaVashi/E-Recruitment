var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    imagefile: {type: String, required: true},
    title: {type: String,required: true},
    skill: {type: String,required: true},
    designation: {type: String,required: true},
    description: {type: String,required: true},
    applierid: [{candidate:{type: mongoose.Schema.Types.ObjectId,ref: 'User'}}],
    cdate: {type: String,required: true}
    
});

module.exports = mongoose.model('Post', Post);