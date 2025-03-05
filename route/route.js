const express = require('express');
const route = express.Router();
const { signup, login, getAllUsers, getUserById, verifyToken, verifyPermissionAdmin } = require('../services/userService');
const { createTask, viewAllTask, viewTaskById, modifyTaskById, deleteTaskById } = require('../services/taskService');

route.route('/auth/signup')
    .post(signup)
route.route('/auth/login')
    .post(login)
route.route('/users')
    .get(verifyToken, verifyPermissionAdmin, getAllUsers)
route.route('/users/:id')
    .get(verifyToken, getUserById)
route.route('/tasks')
    .get(verifyToken, viewAllTask)
    .post(verifyToken, createTask)
route.route('/tasks/:id')
    .get(verifyToken, viewTaskById)
    .patch(verifyToken, modifyTaskById)
    .delete(verifyToken, deleteTaskById)

module.exports = route;