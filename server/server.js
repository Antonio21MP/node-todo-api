var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoDB');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: false
    }
});

var User = mongoose.model('Users', {
    email: { 
        type: String,
        require: true,
        minlength: 1,
        trim: true
    }
})

var newUser = new User({
    email: 'antonio.mperdomo21@gmail.com'
});

newUser.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save user');
});
/*
var newTodo = new Todo({
    text: 'Cook dinner'
});
*/
/*
var newTodo = new Todo({
    text: 'Cook lunch',
    completed: 'false',
    completedAt: 0
});
newTodo.save().then((doc) => {
    console.log(JSON.stringify(doc, undefined, 2));
}, (err) => {
    console.log('Unable to save todo. ', err);
});
*/