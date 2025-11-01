const express = require('express');
const router = express.Router();
const WasteCollection = require('../models/WasteCollection');

// GET ALL RECORDS - with optional filtering
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all records with filters:', req.query);
    
    const { zone, date } = req.query;
    let filter = {};
    
    if (zone && zone !== '') {
      filter.zoneName = { $regex: zone, $options: 'i' };
    }
    
    if (date && date !== '') {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      filter.collectionDate = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    const records = await WasteCollection.find(filter).sort({ collectionDate: -1 });
    console.log(`Found ${records.length} records`);
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET SINGLE RECORD BY ID
router.get('/:id', async (req, res) => {
  try {
    const record = await WasteCollection.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CREATE NEW RECORD
router.post('/', async (req, res) => {
  try {
    console.log('Creating new record:', req.body);
    
    const { zoneName, collectionDate, vehicleId, wasteQuantity } = req.body;
    
    // Validate collection date is not in future
    const selectedDate = new Date(collectionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return res.status(400).json({ message: 'Collection date cannot be in the future' });
    }
    
    // Validate waste quantity
    if (wasteQuantity <= 0) {
      return res.status(400).json({ message: 'Waste quantity must be greater than 0' });
    }
    
    const newRecord = new WasteCollection({
      zoneName,
      collectionDate: selectedDate,
      vehicleId,
      wasteQuantity: parseFloat(wasteQuantity)
    });
    
    const savedRecord = await newRecord.save();
    console.log('Record saved successfully:', savedRecord._id);
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(400).json({ message: 'Error creating record', error: error.message });
  }
});

// UPDATE RECORD
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating record:', req.params.id, req.body);
    
    const { zoneName, collectionDate, vehicleId, wasteQuantity } = req.body;
    
    // Validate collection date is not in future
    const selectedDate = new Date(collectionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return res.status(400).json({ message: 'Collection date cannot be in the future' });
    }
    
    // Validate waste quantity
    if (wasteQuantity <= 0) {
      return res.status(400).json({ message: 'Waste quantity must be greater than 0' });
    }
    
    const updatedRecord = await WasteCollection.findByIdAndUpdate(
      req.params.id,
      {
        zoneName,
        collectionDate: selectedDate,
        vehicleId,
        wasteQuantity: parseFloat(wasteQuantity)
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    console.log('Record updated successfully');
    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(400).json({ message: 'Error updating record', error: error.message });
  }
});

// DELETE RECORD
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting record:', req.params.id);
    
    const deletedRecord = await WasteCollection.findByIdAndDelete(req.params.id);
    
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    console.log('Record deleted successfully');
    res.json({ 
      message: 'Record deleted successfully',
      deletedRecord: deletedRecord 
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ message: 'Error deleting record', error: error.message });
  }
});

module.exports = router;