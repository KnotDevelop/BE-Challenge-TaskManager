const err = require('../utils/errorHandle');
const pool = require('../db/pool')

exports.createTask = async (req, res, next) => {
    try {
        const body = req.body;

        const checkUserSql = `SELECT * FROM users
                                WHERE id=$1;`;
        const checkUserSqlResult = await pool.query(checkUserSql, [body.assignedto]);
        if (checkUserSqlResult.rowCount <= 0) {
            return err.mapError(404, 'User assignedto not found', next);
        }

        const sql = `INSERT INTO tasks (title, description, status, assignedto, duedate)
                    VALUES ($1, $2, $3, $4, $5);`;
        const deadline = new Date(Date.now() + 60 * 60 * 24 * 1000 * body.duedate);
        const result = await pool.query(sql, [body.title, body.description, body.status, body.assignedto, deadline]);
        if (result.rowCount > 0) {
            return res.status(200).json({ status: "Success", message: "Create task success" });
        } else {
            return err.mapError(400, 'Create task fail', next);
        }
    } catch (error) {
        console.log(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.viewAllTask = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC;');
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', data: result.rows });
        } else {
            return err.mapError(404, 'Tasks not found', next);
        }
    } catch (error) {
        console.error(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.viewTaskById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM tasks
                    WHERE id=$1;`;
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', data: result.rows[0] });
        } else {
            return err.mapError(404, 'Tasks not found', next);
        }
    } catch (error) {
        console.error(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.modifyTaskById = async (req, res, next) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const sqlFindTask = `SELECT * FROM tasks
                            WHERE id=$1;`;
        const resultFindTask = await pool.query(sqlFindTask, [id]);
        if (resultFindTask.rowCount <= 0) {
            return err.mapError(400, 'Task not found', next);
        }
        if (!verifyTaskEdior(resultFindTask.rows[0].assignedto, req.user.id, req.user.role)) {
            return err.mapError(401, 'Invalid Permission', next);
        }
        let title = resultFindTask.rows[0].title;
        let description = resultFindTask.rows[0].description;
        let status = resultFindTask.rows[0].status;
        let assignedto = resultFindTask.rows[0].assignedto;
        let duedate = resultFindTask.rows[0].duedate;
        if (body.title)
            title = body.title
        if (body.description)
            description = body.description
        if (body.status)
            status = body.status
        if (body.assignedto)
            assignedto = body.assignedto
        if (body.duedate)
            duedate = body.duedate

        const sql = `UPDATE tasks
                    SET title=$1, description=$2, status=$3, assignedto=$4, duedate=$5
                    WHERE id=$6;`;
        const result = await pool.query(sql, [title, description, status, assignedto, duedate, id]);
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', message: "Updated task success" });
        } else {
            return err.mapError(400, 'Updated task fail', next);
        }
    } catch (error) {
        console.error(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
exports.deleteTaskById = async (req, res, next) => {
    try {
        const id = req.params.id;

        const sqlFindTask = `SELECT * FROM tasks
                            WHERE id=$1;`;
        const resultFindTask = await pool.query(sqlFindTask, [id]);
        if (resultFindTask.rowCount <= 0) {
            return err.mapError(400, 'Task not found', next);
        }
        if (!verifyTaskEdior(resultFindTask.rows[0].assignedto, req.user.id, req.user.role)) {
            return err.mapError(401, 'Invalid Permission', next);
        }

        const sql = `DELETE FROM tasks
                    WHERE id=$1;`;
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ status: 'Success', message: "Delete task success" });
        } else {
            return err.mapError(400, 'Delete task fail', next);
        }
    } catch (error) {
        console.error(error);
        return err.mapError(500, 'Internal server error', next);
    }
}
const verifyTaskEdior = (assignedto, userID, role) => {
    try {
        console.log(assignedto, userID, role);
        if (assignedto === userID || role === 'admin') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}