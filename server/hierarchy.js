const express = require('express');
const mongoose = require('mongoose');

// Business Vertical Schema
const verticalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Line of Business Schema
const lobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  verticalId: { type: mongoose.Schema.Types.ObjectId, ref: 'verticals', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Touchpoint Schema
const touchpointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  lobId: { type: mongoose.Schema.Types.ObjectId, ref: 'lineofbusinesses', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Vertical = mongoose.model('verticals', verticalSchema);
const LineOfBusiness = mongoose.model('lineofbusinesses', lobSchema);
const Touchpoint = mongoose.model('touchpoints', touchpointSchema);

// Legacy schema for backward compatibility
const hierarchyNodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  level: { type: Number, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'hierarchynodes' },
  createdAt: { type: Date, default: Date.now }
});

const HierarchyNode = mongoose.model('hierarchynodes', hierarchyNodeSchema);

const router = express.Router();

// Business Verticals (Hierarchies) Routes
router.get('/hierarchies', async (req, res) => {
  try {
    const verticals = await Vertical.find().sort({ createdAt: -1 });
    res.json(verticals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hierarchies', async (req, res) => {
  try {
    const vertical = new Vertical(req.body);
    await vertical.save();
    res.status(201).json(vertical);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Line of Business Routes
router.get('/hierarchies/:verticalId/lineofbusiness', async (req, res) => {
  try {
    const lobs = await LineOfBusiness.find({ verticalId: req.params.verticalId }).sort({ createdAt: -1 });
    res.json(lobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hierarchies/:verticalId/lineofbusiness', async (req, res) => {
  try {
    const lob = new LineOfBusiness({ ...req.body, verticalId: req.params.verticalId });
    await lob.save();
    res.status(201).json(lob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Touchpoint Routes
router.get('/lineofbusiness/:lobId/touchpoints', async (req, res) => {
  try {
    const touchpoints = await Touchpoint.find({ lobId: req.params.lobId }).sort({ createdAt: -1 });
    res.json(touchpoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/lineofbusiness/:lobId/touchpoints', async (req, res) => {
  try {
    const touchpoint = new Touchpoint({ ...req.body, lobId: req.params.lobId });
    await touchpoint.save();
    res.status(201).json(touchpoint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Legacy routes for backward compatibility
router.get('/hierarchy', async (req, res) => {
  try {
    const { level, parentId } = req.query;
    const query = level ? { level: parseInt(level) } : {};
    if (parentId) query.parentId = parentId;
    if (level === '1') query.parentId = { $exists: false };
    
    const nodes = await HierarchyNode.find(query).sort({ createdAt: -1 });
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/hierarchy', async (req, res) => {
  try {
    const node = new HierarchyNode(req.body);
    await node.save();
    res.status(201).json(node);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/hierarchy/:id', async (req, res) => {
  try {
    const deleteRecursive = async (nodeId) => {
      const children = await HierarchyNode.find({ parentId: nodeId });
      for (const child of children) {
        await deleteRecursive(child._id);
      }
      await HierarchyNode.findByIdAndDelete(nodeId);
    };
    
    await deleteRecursive(req.params.id);
    res.json({ message: 'Node deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;