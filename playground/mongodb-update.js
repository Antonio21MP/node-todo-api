const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users').findOneAndUpdate({
        _id: ObjectID('5acaf23415abbc0d85b1063a')}, 
        {
            $set: {
                name: 'Alex'
            },
            $inc: {
                age: 1
            }
        },
        {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to update users.', err);
        });
});