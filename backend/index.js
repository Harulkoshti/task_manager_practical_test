const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let tasks = []

// Simple in-memory cache
const cache = {
  data: null,
  isValid: false,
  expiresAt: 0
}

const CACHE_TTL_MS = 60 * 1000

// Middleware to serve from cache for GET requests
const checkCache = (req, res, next) => {
  if (req.method === 'GET' && req.path === '/tasks') {
    if(cache.isValid && Date.now() < cache.expiresAt) {
        console.log('Serving GET /tasks from cache');
        return res.json(cache.data)
    } else if(cache.isValid) {
        console.log('Cache expired')
        cache.isValid = false
    }
  }
  next();
}

// Middleware to invalidate cache on data modification
const invalidateCache = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    cache.isValid = false;
  }
  next();
}

app.use(checkCache)
app.use(invalidateCache)

app.get('/tasks', (req, res) => {
  // Update cache before sending response
  cache.data = tasks;
  cache.isValid = true;
  cache.expiresAt = Date.now() + CACHE_TTL_MS;
  res.json(tasks)
})

app.post('/tasks', (req, res) => {
  const {name} = req.body
  if(!name || name.trim() === '') {
    return res.status(400).json({error: 'Task name is required'})
  }

  const newTask = {
    id: Date.now().toString(),
    name: name.trim(),
    status: 'pending'
  }

  tasks.push(newTask)
  res.status(201).json(newTask)
})

app.put('/tasks/:id', (req, res) => {
    const {id} = req.params
    const task =  tasks.find(t => t.id === id)

    if(!task) {
        return res.status(404).json({error: 'Task not found'})
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending'
    res.json(task)
})

app.delete('/tasks/:id', (req, res) => {
    const {id} = req.params
    const taskIndex = tasks.findIndex(t => t.id === id);

    if(taskIndex === -1) {
        return res.status(404).json({error: 'Task not found'})
    }

    tasks.splice(taskIndex, 1)
    res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
