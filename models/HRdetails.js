var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HRschema = new Schema({
    userid: {type: String,required: true},
    imagefile: {type: String, required: true},
    websitelink: {type: String, required: true},
    docstatus: {type: String,required: true,default: '0'}
    
});

module.exports = mongoose.model('HRDetails', HRschema);