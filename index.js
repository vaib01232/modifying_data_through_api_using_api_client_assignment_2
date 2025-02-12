require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MenuItem = require('./schema');

const app = express();

app.use(express.json());
app.use(cors());

const port = 3010;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

app.put('/menu/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) { 
      return res.status(400).json({
        success: false,
        message: 'Name and Price are required',
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message,
    });
  }
});

app.delete('/menu/:id', async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedMenuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message,
    });
  }
});
