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
// Create a new property record
router.post('/', async (req, res) => {
    const propertyData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [propertyData.house_no]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(409).json({ message: 'Property record already exists' });
            return;
        }
        // Insert the new property data
        const [result] = await connection.execute(`INSERT INTO tb_Property 
            (house_no, owner, tenant, propertyuse, propertytype, propertyclass, 
            electroral_area, landmark, street_name, lattitude, longitude, 
            code, elevation, rate, Assessmentby, balance, 
            PropertyUseRate, PropertytypeRate, PropertyclassRate) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            propertyData.house_no,
            propertyData.owner,
            propertyData.tenant,
            propertyData.propertyuse,
            propertyData.propertytype,
            propertyData.propertyclass,
            propertyData.electroral_area,
            propertyData.landmark,
            propertyData.street_name,
            propertyData.lattitude,
            propertyData.longitude,
            propertyData.code,
            propertyData.elevation,
            propertyData.rate,
            propertyData.Assessmentby,
            propertyData.balance,
            propertyData.PropertyUseRate,
            propertyData.PropertytypeRate,
            propertyData.PropertyclassRate,
        ]);
        res.status(201).json({ message: 'Property record created successfully' });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error creating property record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read all property records
router.get('/', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Property');
        res.json(rows);
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property records', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Read a single property record by house_no
router.get('/:house_no', async (req, res) => {
    const { house_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [house_no]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]); // Return the first row
            return;
        }
        else {
            res.status(404).json({ message: 'Property record not found' });
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching property record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Update a property record
router.put('/:house_no', async (req, res) => {
    const { house_no } = req.params;
    const propertyData = req.body;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [propertyData.house_no]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Property record not exist' });
            return;
        }
        // Update the property data
        const [result] = await connection.execute(`UPDATE tb_Property 
            SET owner = ?, tenant = ?, propertyuse = ?, propertytype = ?, 
            propertyclass = ?, electroral_area = ?, landmark = ?, 
            street_name = ?, lattitude = ?, longitude = ?, 
            code = ?, elevation = ?, rate = ?, Assessmentby = ?, 
            balance = ?, PropertyUseRate = ?, 
            PropertytypeRate = ?, PropertyclassRate = ? 
            WHERE house_no = ?`, [
            propertyData.owner,
            propertyData.tenant,
            propertyData.propertyuse,
            propertyData.propertytype,
            propertyData.propertyclass,
            propertyData.electroral_area,
            propertyData.landmark,
            propertyData.street_name,
            propertyData.lattitude,
            propertyData.longitude,
            propertyData.code,
            propertyData.elevation,
            propertyData.rate,
            propertyData.Assessmentby,
            propertyData.balance,
            propertyData.PropertyUseRate,
            propertyData.PropertytypeRate,
            propertyData.PropertyclassRate,
            house_no
        ]);
        res.status(200).json({ message: 'Property record updated successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating property record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// Delete a property record
router.delete('/:house_no', async (req, res) => {
    const { house_no } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [rows] = await connection.execute('SELECT * FROM tb_Property WHERE house_no = ?', [house_no]);
        if (Array.isArray(rows) && rows.length == 0) {
            res.status(409).json({ message: 'Property record does not exist' });
            return;
        }
        // Delete the property record
        const [result] = await connection.execute('DELETE FROM tb_Property WHERE house_no = ?', [house_no]);
        res.status(200).json({ message: 'Property record deleted successfully' });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting property record', error });
        return;
    }
    finally {
        connection.end();
    }
});
// import express from 'express';
// import sql from 'mssql';
// const app = express();
// app.use(express.json());
// const config = {
//     user: 'sa',
//     password: 'Timbuk2tu',
//     server: '(local)',
//     database: 'Saltpond',
//     options: {
//         encrypt: false,
//         trustServerCertificate: true,
//     }
// };
// app.get('/api/officers', async (req, res) => {
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT officer_no, officer_name FROM tb_officer`;
//         res.json(result.recordset);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });
// // Add similar endpoints for properties, property-types, property-uses, property-classes, electoral-areas, and property-details
// app.post('/api/edit-property', async (req, res) => {
//     const { house_no, owner, tenant, propertyuse, propertytype, propertyclass, electroral_area, landmark, street_name, lattitude, longitude, code, elevation, rate, propertyuserate, propertytyperate, propertyclassrate, assessmentby } = req.body;
//     try {
//         await sql.connect(config);
//         const updateProperty = await sql.query`
//             UPDATE tb_Property 
//             SET owner = ${owner}, 
//                 tenant = ${tenant}, 
//                 propertyuse = ${propertyuse}, 
//                 propertytype = ${propertytype}, 
//                 propertyclass = ${propertyclass}, 
//                 electroral_area = ${electroral_area}, 
//                 landmark = ${landmark}, 
//                 street_name = ${street_name}, 
//                 lattitude = ${lattitude}, 
//                 longitude = ${longitude}, 
//                 code = ${code}, 
//                 elevation = ${elevation}, 
//                 rate = ${rate}, 
//                 propertyuserate = ${propertyuserate}, 
//                 propertytyperate = ${propertytyperate}, 
//                 propertyclassrate = ${propertyclassrate}, 
//                 assessmentby = ${assessmentby}
//             WHERE house_no = ${house_no}
//         `;
//         if (updateProperty.rowsAffected[0] > 0) {
//             res.send("Record successfully edited");
//         } else {
//             res.send("Record does not exist");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });
// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
export default router;
//# sourceMappingURL=propertyRoutes.js.map