var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var passport = require('passport');
const multer = require('multer');
const path = require('path');
router.use(express.static(__dirname + "./public/"));
// var upload = multer({ dest: 'public/uploads/' })
var user= require('../models/user');
var hrins=require('../models/HRdetails');
var postins = require('../models/Post');
var notifi = require('../models/Notification');


router.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    next();
});

router.get('/', function (req, res, next) {
    res.render('shop/index', {title: 'Shopping Cart'});
    
});

router.get('/user/signup', function(req, res, next) {
    console.log("signup Page")
    var messages = req.flash('error');
    res.render('user/signup', {hasErrors: messages.length > 0, messages: messages});
});


var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var proupload = multer({
    storage: Storage
}).single('file1');


router.post('/user/signup',proupload, passport.authenticate('local.signup', {
    successRedirect: '/user/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {hasErrors: messages.length > 0, messages: messages});
});


// router.get('/user/profile1',function(req,res,next){
//     res.render('user/profile1');
// });
router.get('/user/HR',function(req,res,next){
    res.render('user/HR');
});
router.get('/user/Candidate',function(req,res,next){
    res.render('user/Candidate');
   });

router.get('/admin',function(req,res,next){
    res.render('admin/admin')
});

//insert post

router.get('/user/sample',function(req,res,next){
    res.render('user/post')
});


var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var uploadd = multer({
    storage: Storage
}).single('filee');


router.post('/user/sample',uploadd,function(req,res,next){
    postins=new postins();
    console.log("recent debug: ", req.body);
    var uid=req.user._id;
    postins.uid=uid;
    postins.imagefile=req.file.filename;
    postins.title=req.body.title;
    postins.skill=req.body.skill;
    postins.designation=req.body.designation;
    postins.description=req.body.description;   
    var d=Date().toString();
    var cdate=d.slice(4,15);

    console.log(cdate);
    postins.cdate=cdate;
    console.log("------------------------------------",uid);
   
    postins.save((err,doc)=>{
        if(!err){
            
            res.render('user/post');
        }
        else{
            console.log('ni thy'+err);
        }
    });
});

router.post('/verification',function(req,res,next){
    const hrid = {userid : req.body.useridd};
    console.log('***************************************88888user' , hrid);
    hrins.updateOne(hrid,{'userid' : req.body.useridd,'docstatus' : '1'},function(err, res) {
       if(!err)
       {
         console.log('doneeeeeeeeeeeeeeeee');
       }
       else{
           console.log('nooooo' + err);
       }
    });
    res.render('admin/viewusers');
});

router.get('/user/profile1',function(req,res,next){
    console.log(req.user.usertype);
    var type=req.user.usertype;
    var name=req.user.fname;
    var userid=req.user._id;
    var status= req.user.status;

    if(type=="0" && status=="0" ){
        console.log(userid);
        
        res.render('user/HR',{name:name,userid:userid});
    }
    if(type=="0" && status=="1" ){
        console.log(userid);
        hrins.find({'userid': userid},(err,dstatus)=> {
            hrins.find({'userid': userid},(err,dstatus)=> {
                if(!err){
                    var st=dstatus[0].docstatus;
                    console.log('st.....'+st);
                    if(st === '0'){
                        res.render('admin/HRrequest');
                    }
                    else{
                        postins.find((err,docs)=>{
                            if(!err)
                            {
                                res.render('user/post',{
                                        list:docs
                                });
                            }
                            else{
                                console.log('Error in View:'+err);
                            }
                        });
                    }
                }
                
            });
        
            
        });
        
       // res.render('user/post',{name:name,userid:userid});
    }
    if(type=="1")

    {
        var postdata = [];
        var userlist = [];
        var uid;
        var applypost = [];
    
        // postins.find((err,docs)=>{
        //     if(!err)
        //     {                
        //         postdata = docs;
        //         userlist.push(postdata);
        //         uid=postdata[0].uid;
        //         console.log('postdata' , postdata);
        //         console.log('uuuuuuuuuuuid------------->>>>>>>>>>>',uid);
        
        //     }
        //     else{
        //         console.log('Error in View:'+err);
        //     }
        // });
       
        
        postins.find().populate('uid').exec().then(function (docs){
            console.log('DOCS======>', docs);
           

            
                res.render('user/Candidate',{
                    list:docs,
                   
                })
                
        });

        // user.find({'_id': uid},(err,data)=>{
        //     if(!err)
        //     {
        //         // userlist.push({docs[0]});
        //         console.log('123456789------------------------->' , data[0],'%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        //         userlist.push({'userdata': data[0]});
        //     }
        //     else{
        //         console.log('Error in View:'+err);
        //     }
        // });
       
        // user.find({'_id': req.user._id},(err,docs)=>{
        //     if(!err)
        //     {
        //         // userlist.push({docs[0]});
        //         console.log('userlisttttttt------------------------->' , userlist,'%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        //         res.render('user/Candidate',{
        //                 list:userlist,list1:docs
        //         });
        //     }
        //     else{
        //         console.log('Error in View:'+err);
        //     }
        // });

    
    }
    if(type=="A")
    {
        res.render('admin/admin')
    }
    
});
router.post('/user/signin', passport.authenticate('local.signin',{
    successRedirect: '/user/profile1',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

router.get('/userprofile', function(req, res, next) {
    var messages = req.flash('error');
    main.find().then((err,docs)=>{
        if(!err)
        {
            res.render('user/userprofile',{
                    list:docs
            });
        }
        else{
            console.log('Error in View:'+err);
        }
    });
   //res.render('user/userprofile', {hasErrors: messages.length > 0, messages: messages});
});

router.post('/userprofile', passport.authenticate('local.signin', {
    successRedirect: '/user/userprofile',
    failureRedirect: '/user/signin',
    failureFlash: true,

}));


router.get('/user/logout', function(req, res, next) {
    req.logout();
    return res.redirect('/');
});


//Notification

router.post('/applypost',function(req,res){
    notifi = new notifi();
    notifi.aid= req.user._id;
    notifi.postid=req.body.postid;

    notifi.save((err)=>{
        if(!err){
            
            res.redirect('user/profile1');
        }
        else{
            console.log('ni thy'+err);
        }
    });
});

//admin

router.get('/admin',function(req,res,next){
    res.render('admin/admin');
});

router.post('/admin',function(req,res,next){
    res.render('admin/viewposts');
});

router.post('/viewusers',function(req,res,next){
    res.render('admin/viewusers');
});

//Deactivate user
router.get('/Delete/:id',function(req,res,next){
    var did ={_id : req.params.id};
    var newvalue = {_id : req.params.id, status: "0" };
    user.updateOne(did, newvalue, function(err) {
        if (err) throw err;
        console.log(newvalue);
       
    });
    res.redirect("/viewusers");
});

//Active User

router.get('/Active/:id',function(req,res,next){
    var did ={_id : req.params.id};
    var newvalue = {_id : req.params.id, status: "1" };
    user.updateOne(did, newvalue, function(err) {
        if (err) throw err;
        console.log(newvalue);
       
    });
    res.redirect("/viewusers");
});

router.get('/viewusers', function(req, res, next) {
    var messages = req.flash('error');
    var userdocs = [];
    user.find((err,docs)=>{
        if(!err)
        {
            userdocs = docs;
        }
        else{
            console.log('Error in View:'+err);
        }
       
    });

    postins.find().populate('uid').exec().then(function (docs){
        console.log('DOCS======>', userdocs);
        
            res.render('admin/viewusers',{
                list:userdocs,list1:docs
            })
            
    });
   //res.render('user/userprofile', {hasErrors: messages.length > 0, messages: messages});
});

router.post('/deletepost',function(req,res,next){
    postins.remove({'_id': req.body.deletepostid},(err)=>{
        if(!err)
        {
            res.render("admin/viewusers");
        }
    });
});


// HR INSERT

router.get('/user/HR',function(req,res,next){
    res.render('user/HR');
});

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
var upload = multer({
    storage: Storage
}).single('file');

router.post('/user/HR',upload,function(req,res,next){
    hrins=new hrins();
    hrins.imagefile=req.file.filename;
    hrins.websitelink=req.body.websitelink;
    hrins.userid=req.body.userid;
    var uid ={_id : req.body.userid};
    var newvalue = {_id : req.body.userid, status: "1" };
    user.updateOne(uid, newvalue, function(err, res) {
        if (err) throw err;
        console.log(newvalue);
        
    });

    hrins.save((err,doc)=>{
        if(!err){
            var userid=req.user._id;
            res.render('admin/HRrequest');
        }
        else{
            console.log('ni thy'+err);
        }
    });
});


//View HR

router.post('/viewhr',function(req,res){
    var messages = req.flash('error');
    var document = req.body.document;
    hrins.find({'userid': document},(err,docs)=>{
        if(!err)
        {
            console.log('hfjtrjyr' , docs);
            res.render('admin/viewhr',{
                
                    list:docs
            });
        }
        else{
            console.log('Error in View:'+err);
        }

});

router.get('/admin/viewhr', function(req, res) {
    res.render('admin/viewhr');
       });
   //res.render('user/userprofile', {hasErrors: messages.length > 0, messages: messages});
});



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.user);

        return next();
    }
    res.redirect('/');
}

module.exports = router;