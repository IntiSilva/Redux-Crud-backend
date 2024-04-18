import express from 'express';
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
});

// Add a new product
router.post('/', async (req, res) => {
    const { name, price } = req.body;
    try {
        const [result] = await req.db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
        const [insertedProduct] = await req.db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
        res.status(201).json(insertedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding the product', error });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        await req.db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the product', error });
    }
});

// Edit a product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    try {
        await req.db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id]);
        const [updatedProduct] = await req.db.query('SELECT * FROM products WHERE id = ?', [id]);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating the product', error });
    }
});

export default router;
