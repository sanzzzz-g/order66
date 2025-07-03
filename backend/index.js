const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory task list
let tasks = [];

// Socket.IO events
io.on('connection', (socket) => {
  // Send current tasks to new client
  socket.emit('tasks', tasks);

  // Add new task
  socket.on('addTask', (task) => {
    tasks.push(task);
    io.emit('tasks', tasks);
  });

  // Complete or delete task
  socket.on('updateTasks', (updatedTasks) => {
    tasks = updatedTasks;
    io.emit('tasks', tasks);
  });
});

// Basic API endpoint
app.get('/', (req, res) => {
  res.send('Sith Productivity Backend is running.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 