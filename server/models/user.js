const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrytp = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: { 
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
}; 

UserSchema.statics.findByToken = function (token){
    var User = this;
    var decode;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return Promise.reject();      
    }

    return User.findOne({
        _id: decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        bcrytp.genSalt(10, (err, salt) => {
            bcrytp.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

UserSchema.statics.findByCrendentials = function (email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrytp.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

var User = mongoose.model('Users', UserSchema);

module.exports = {
    User
}