const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use((req, res) => {
    console.log('Not found...');
});

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('updateData', () => {
        socket.emit('updateData', tasks);
    });

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (taskIndex) => {
        tasks.splice(tasks.indexOf(tasks.filter(task => task.id === taskIndex)[0]), 1);
        socket.broadcast.emit('removeTask', taskIndex);
    });

    socket.on('editRecord', (taskChange) => {
        tasks.map(task => {if(task.id === taskChange.id) task.task = taskChange.taskChange});
        socket.broadcast.emit('editRecord', (taskChange));
    });
});
