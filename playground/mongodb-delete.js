const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //delete many
/*
    db.collection('Todos').deleteMany({text: 'Something to do.'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete.', err);
    });
*/
    //delete one
    /*
    db.collection('Todos').deleteOne({text: 'Eat something.'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to delete.', err);
    });*/
    //find one and delete
    
    //client.close();
    db.collection('Todos').findOneAndDelete({text: 'Do exercise.'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log('Unable to find and delete');
    })
});