var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    gender: {type: String,required: true},
    contactno: {type: String, required: true},
    imagefile: {type: String, required: true},
    education: {type: String, required: true},
    workexperience: {type: String,required: true},
    areaofinterest: {type: String, required: true},
    skills: {type: String, required: true},
    toolsandtechnology: {type: String, required: true},
    usertype:{type:String,required:true},
    status: {type: String,required: true}
     
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.get('/profile',function(req,res){
    user.find({},function(err,docs){
        if(err)res.json(err);
        else res.render('index',{user:docs});
    });
});
 module.exports = mongoose.model('User', userSchema);


