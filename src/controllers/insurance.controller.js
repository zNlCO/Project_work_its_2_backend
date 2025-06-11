const Insurance = require('../models/insurance.model');

// Get all insurances
const getAllInsurances = async (req, res) => {
  try {
    const insurances = await Insurance.find();
    res.json({
      success: true,
      data: insurances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving insurances'
    });
  }
};

// Get single insurance
const getInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);
    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }
    res.json({
      success: true,
      data: insurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving insurance'
    });
  }
};

// Create insurance
const createInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.create(req.body);
    res.status(201).json({
      success: true,
      data: insurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating insurance'
    });
  }
};

// Update insurance
const updateInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }
    res.json({
      success: true,
      data: insurance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating insurance'
    });
  }
};

// Delete insurance
const deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);
    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance not found'
      });
    }
    res.json({
      success: true,
      message: 'Insurance deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting insurance'
    });
  }
};

module.exports = {
  getAllInsurances,
  getInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance
}; 