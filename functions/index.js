const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBmdb1oovgDi2H1q43kaXaMsJgGmQMbWF0",
    authDomain: "bishops-schedule.firebaseapp.com",
    databaseURL: "https://bishops-schedule.firebaseio.com",
    projectId: "bishops-schedule",
    storageBucket: "bishops-schedule.appspot.com",
    messagingSenderId: "197145707576"
});

function getTasks() {
    const ref = firebaseApp.database().ref('tasks');
    return ref.once('value').then(snap => snap.val());
}

function setTasks(id, checked) {
    firebaseApp.database().ref('tasks/' + id).update({
        isDone: (checked == "true")
    });
}

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/'));

app.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=5, s-maxage=10')
    getTasks().then(tasks => {
        response.render('index', { tasks });
    })
});

app.get('/tasks.json', (request, response) => {
    response.set('Cache-Control', 'public, max-age=5, s-maxage=10')
    getTasks().then(tasks => {
        response.json(tasks);
    });
});

app.post('/endpoint', function (request, response) {
    body = request.body;
    setTasks(body.id, body.isChecked);
    response.send(request.body);
});

exports.app = functions.https.onRequest(app);