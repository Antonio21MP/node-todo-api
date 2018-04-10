var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoDB');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});
/*
var newTodo = new Todo({
    text: 'Cook dinner'
});
*/
var newTodo = new Todo({
    text: 'Cook lunch',
    completed: 'false',
    completedAt: 0
});
newTodo.save().then((doc) => {
    console.log('Save todo. ',doc);
}, (err) => {
    console.log('Unable to save todo. ', err);
});