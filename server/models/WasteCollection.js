const mongoose = require('mongoose');

const wasteCollectionSchema = new mongoose.Schema({
  zoneName: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true,
    minLength: [2, 'Zone name must be at least 2 characters long']
  },
  collectionDate: {
    type: Date,
    required: [true, 'Collection date is required']
  },
  vehicleId: {
    type: String,
    required: [true, 'Vehicle ID is required'],
    trim: true
  },
  wasteQuantity: {
    type: Number,
    required: [true, 'Waste quantity is required'],
    min: [0.01, 'Waste quantity must be greater than 0']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WasteCollection', wasteCollectionSchema);