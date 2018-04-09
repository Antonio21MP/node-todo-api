const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users').find({name: 'Antonio'}).count().then((name) => {
        console.log(`Users with that name: ${name}`);
    }, (err) => {
        console.log('Unalbe to fetch users');
    })
    client.close();
});