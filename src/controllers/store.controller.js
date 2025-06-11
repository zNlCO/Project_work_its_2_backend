const Store = require('../models/store.model');

// Get all stores
const getAllStores = async (req, res) => {
  console.log('getAllStores controller called');
  try {
    console.log('Attempting to find stores...');
    const stores = await Store.find();
    console.log('Found stores:', stores);
    res.json({
      success: true,
      data: stores
    });
  } catch (error) {
    console.error('Error in getAllStores:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving stores'
    });
  }
};

// Get single store
const getStore = async (req, res) => {
  console.log('getStore controller called with id:', req.params.id);
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      console.log('Store not found with id:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    console.log('Found store:', store);
    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error in getStore:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving store'
    });
  }
};

// Create store
const createStore = async (req, res) => {
  console.log('createStore controller called with body:', req.body);
  try {
    const store = await Store.create(req.body);
    console.log('Created store:', store);
    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error in createStore:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating store'
    });
  }
};

// Update store
const updateStore = async (req, res) => {
  console.log('updateStore controller called with id:', req.params.id, 'and body:', req.body);
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!store) {
      console.log('Store not found with id:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    console.log('Updated store:', store);
    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Error in updateStore:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating store'
    });
  }
};

// Delete store
const deleteStore = async (req, res) => {
  console.log('deleteStore controller called with id:', req.params.id);
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      console.log('Store not found with id:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }
    console.log('Deleted store:', store);
    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStore:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting store'
    });
  }
};

module.exports = {
  getAllStores,
  getStore,
  createStore,
  updateStore,
  deleteStore
};

module.exports = {
  getAllStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  findNearbyStores,
  checkStoreAvailability,
  getStoreInventory
}; 