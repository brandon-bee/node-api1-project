// BUILD YOUR SERVER HERE
const express = require('express');
const model = require('./users/model');
const server = express();
server.use(express.json());
// ENDPOINTS
server.get('/', (req, res) => {
  res.json('hello world! -server');
});

server.post('/api/users', (req, res) => {
  let body = req.body;
  if (!body.name || !body.bio) {
    res.status(400).json({
      message: "Please provide name and bio for the user"
    });
  } else {
    model.insert(body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the user to the database"
        });
      });
  }
});

server.get('/api/users', (req, res) => {
  model.find()
    .then(users => {
      res.json(users);
    })
    .catch(() => {
      res.status(500).json({
        message: "The users information could not be retrieved"
      });
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  model.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist"
        });
      } else {
        res.json(user);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The user information could not be retrieved"
      });
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  model.remove(id)
    .then(user => {
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist"
        });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The user could not be removed"
      });
    });
});

server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await model.findById(id);
    if (!user) {
      res.status(404).json({
        message: "The user with the specified ID does not exist"
      });
    } else {
      const body = req.body;
      if (!body.name || !body.bio) {
        res.status(400).json({
          message: "Please provide name and bio for the user"
        });
      } else {
        const updatedUser = await model.update(id, body);
        res.status(200).json(updatedUser);
      }
    }
  } catch(e) {
    res.status(500).json({
      message: "The user information could not be modified"
    });
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}