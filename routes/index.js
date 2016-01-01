var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/user');
var multer = require('multer');
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/dataset/');
  },
  filename: function (req, file, cb) {
    var userID = req.params.userID; 
    console.log(userID);
    cb(null, userID + '_' + file.originalname);
  }
});

var upload = multer({storage: storage});

var hash = function(password) {
    return bcrypt.hashSync(password, 10);
}

var validPassword = function(password, valid) {
    return bcrypt.compareSync(password, valid);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
    var username = req.body.username;
    var password = hash(req.body.password);

    User.findOne({username: username}, function(error, user) {
        if (error) {
            console.log(error);
            res.send({state: 'error', reason: error});
        } 

        if (user) {
            res.send({state: 'error', reason: 'user existed'})
        } else {
            newUser = new User({
                username: username,
                password: password,
                dataset: null
            });
            newUser.save(function(error) {
                if (error) {
                    console.log(error);
                    res.send({state: 'error', reason: error});
                }
                res.send({state: 'OK'});
            });
        }
    });

});

router.post('/signin', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username}, function(error, user) {
        if (error) {
            console.log(error);
            res.send({state: 'error', reason: error});
        } 

        if (user) {
            if (validPassword(password, user.password)) {
                res.send({state: 'OK', userID: user._id});
            } else {
                res.send({state: 'error', reason: 'password incorrect'});
            }
        } else {
            res.send({state: 'error', reason: 'user not existed'})
        }
    });
});

router.post('/dataset/:userID', upload.single('dataset'), function(req, res, next) {
    res.send({state: 'OK'});
});

router.get('/dataset/:fileName', function(req, res, next) {
    res.download('public/dataset/' + req.params.fileName);
});

module.exports = router;
