require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const {ObjectID} = require('mongodb');
const app = express();
const _ = require('lodash');

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todo', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt    
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todo', (req, res) => {
  Todo.find().then((todo) => {
    res.send({todo});
  }, (err) => {
    res.status(400).send(err);
  })
});

app.get('/todo/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
      res.status(200).send({todo});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.delete('/todo/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

app.patch('/todo/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime(); 
  }else{
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) =>{
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Started up at port: ${port}`);
});

module.exports = {app};