const express = require('express');
const app = express();
const bodyParser = require('body-parser');



const port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.use('/tasks');



app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const tasks = [];

// Ruta para crear una tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    const newTask = {
        id: tasks.length + 1,
        title,
        description,
    };
    tasks.push(newTask);
    res.json(newTask);
});

// Ruta para obtener todas las tareas
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Ruta para obtener una tarea por ID
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
        res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
        res.json(task);
    }
});

// Ruta para actualizar una tarea por ID
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    const existingTaskIndex = tasks.findIndex((t) => t.id === taskId);
    if (existingTaskIndex === -1) {
        res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
        tasks[existingTaskIndex] = { ...tasks[existingTaskIndex], ...updatedTask };
        res.json(tasks[existingTaskIndex]);
    }
});

// Ruta para eliminar una tarea por ID
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const existingTaskIndex = tasks.findIndex((t) => t.id === taskId);
    if (existingTaskIndex === -1) {
        res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
        const deletedTask = tasks.splice(existingTaskIndex, 1);
        res.json(deletedTask[0]);
    }
});

app.get('/tasks/filter', (req, res) => {
    const { status } = req.query;
    const filteredTasks = tasks.filter((task) => task.status === status);
    res.json(filteredTasks);
  });

  app.put('/tasks/:id/status', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = { ...req.body, status: req.body.status || 'pendiente' }; // Establecer el estado por defecto si no se proporciona
    const existingTaskIndex = tasks.findIndex((t) => t.id === taskId);
    if (existingTaskIndex === -1) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      tasks[existingTaskIndex] = { ...tasks[existingTaskIndex], ...updatedTask };
      res.json(tasks[existingTaskIndex]);
    }
  });

  app.put('/tasks/:id/tags', (req, body) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = { ...req.body, tags: [...(req.body.tags || []), ...(tasks.find((t) => t.id === taskId)?.tags || [])] }; // Añadir las etiquetas existentes si no se proporcionan
    const existingTaskIndex = tasks.findIndex((t) => t.id === taskId);
    if (existingTaskIndex === -1) {
      res.status(404).json({ error: 'Tarea no encontrada' });
    } else {
      tasks[existingTaskIndex] = { ...tasks[existingTaskIndex], ...updatedTask };
      res.json(tasks[existingTaskIndex]);
    }
  });

  app.get('/tasks/sort', (req, res) => {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b[sortOrder]) - new Date(a[sortOrder]);
      } else if (sortBy === 'updatedAt') {
        return new Date(b[sortOrder]) - new Date(a[sortOrder]);
      }
      return 0;
    });
    res.json(sortedTasks);
  });