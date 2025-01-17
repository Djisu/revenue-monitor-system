import * as dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2/promise';
const router = Router();
// Load environment variables from .env file
dotenv.config();
// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'revmonitor',
};
// Create a new GradeRate record
router.post('/', async (req, res) => {
    const gradeRateData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', [gradeRateData.grade, gradeRateData.minValuex, gradeRateData.maxValuex]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'GradeRate record already exists' });
            return;
        }
        // Insert the new GradeRate data
        const [result] = await connection.execute(`INSERT INTO tb_graderate (grade, minValuex, maxValuex, rate) 
            VALUES (?, ?, ?, ?)`, [
            gradeRateData.grade,
            gradeRateData.minValuex,
            gradeRateData.maxValuex,
            gradeRateData.rate,
        ]);
        res.status(201).json({ message: 'GradeRate record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating GradeRate record', error });
    }
    finally {
        connection.end();
    }
});
// Read all GradeRate records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_graderate');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching GradeRate records', error });
    }
    finally {
        connection.end();
    }
});
// Read a single GradeRate record by grade
router.get('/:grade/:minValuex/:maxValuex', async (req, res) => {
    const { grade, minValuex, maxValuex } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [result] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', [grade, minValuex, maxValuex]);
        if (Array.isArray(result) && result.length > 0) {
            res.status(409).json({ message: 'GradeRate record already exists' });
            return;
        }
        const [rows] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ?', [grade]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
        }
        else {
            res.status(404).json({ message: 'GradeRate record not found' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching GradeRate record', error });
    }
    finally {
        connection.end();
    }
});
// Update a GradeRate record
router.put('/:grade/:minValuex/:maxValuex', async (req, res) => {
    const { grade, minValuex, maxValuex } = req.params;
    const gradeRateData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [row] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', [grade, minValuex, maxValuex]);
        if (Array.isArray(row) && row.length == 0) {
            res.status(409).json({ message: 'GradeRate record does not exist' });
            return;
        }
        // Update the GradeRate data
        const [result] = await connection.execute(`UPDATE tb_graderate SET minValuex = ?, maxValuex = ?, rate = ? 
            WHERE grade = ?`, [
            gradeRateData.minValuex,
            gradeRateData.maxValuex,
            gradeRateData.rate,
            grade
        ]);
        res.status(200).json({ message: 'GradeRate record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating GradeRate record', error });
    }
    finally {
        connection.end();
    }
});
// Delete a GradeRate record
router.delete('/:grade/:minValuex/:maxValuex', async (req, res) => {
    const { grade, minValuex, maxValuex } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [row] = await connection.execute('SELECT * FROM tb_graderate WHERE grade = ? AND minValuex = ? AND maxValuex = ?', [grade, minValuex, maxValuex]);
        if (Array.isArray(row) && row.length > 0) {
            res.status(409).json({ message: 'GradeRate record already exists' });
            return;
        }
        // Delete the GradeRate record
        const [result] = await connection.execute('DELETE FROM tb_graderate WHERE grade = ?', [grade]);
        res.status(200).json({ message: 'GradeRate record deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting GradeRate record', error });
    }
    finally {
        connection.end();
    }
});
export default router;
//# sourceMappingURL=gradeRateRoutes.js.map