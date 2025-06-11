const Accessory = require('../models/accessory.model');

// Get all accessories
const getAllAccessories = async (req, res) => {
  try {
    const accessories = await Accessory.find();
    res.json({
      success: true,
      data: accessories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving accessories'
    });
  }
};

// Get single accessory
const getAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id);
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }
    res.json({
      success: true,
      data: accessory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving accessory'
    });
  }
};

// Create accessory
const createAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.create(req.body);
    res.status(201).json({
      success: true,
      data: accessory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating accessory'
    });
  }
};

// Update accessory
const updateAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }
    res.json({
      success: true,
      data: accessory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating accessory'
    });
  }
};

// Delete accessory
const deleteAccessory = async (req, res) => {
  try {
    const accessory = await Accessory.findByIdAndDelete(req.params.id);
    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      });
    }
    res.json({
      success: true,
      message: 'Accessory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting accessory'
    });
  }
};

module.exports = {
  getAllAccessories,
  getAccessory,
  createAccessory,
  updateAccessory,
  deleteAccessory
}; 