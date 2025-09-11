const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hierarchyRoutes = require('./hierarchy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surveys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Survey Hierarchy Schema
const surveyHierarchySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  type: { type: String, enum: ['vertical', 'lob', 'touchpoint'], required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'SurveyHierarchy' },
  expanded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const SurveyHierarchy = mongoose.model('SurveyHierarchy', surveyHierarchySchema);

const surveySchema = new mongoose.Schema({
  title: String,
  description: String,
  surveyJson: Object,
  isRunning: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const responseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'newsurvays', required: true },
  responses: Object,
  submittedAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('newsurvays', surveySchema);
const Response = mongoose.model('responses', responseSchema);

app.post('/api/surveys', async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json(survey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.aggregate([
      {
        $lookup: {
          from: 'responses',
          localField: '_id',
          foreignField: 'surveyId',
          as: 'responses'
        }
      },
      {
        $addFields: {
          responseCount: { $size: '$responses' }
        }
      },
      {
        $project: {
          responses: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/surveys/:id', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/surveys/:id', async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Survey deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/surveys/:id/responses', async (req, res) => {
  try {
    const response = new Response({
      surveyId: req.params.id,
      responses: req.body
    });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/surveys/:id/responses', async (req, res) => {
  try {
    const responses = await Response.find({ surveyId: req.params.id }).sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/surveys/:id/toggle', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    survey.isRunning = !survey.isRunning;
    survey.updatedAt = new Date();
    await survey.save();
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use hierarchy routes
app.use('/api', hierarchyRoutes);

// Survey Hierarchy Routes
app.get('/api/survey-hierarchy', async (req, res) => {
  try {
    const hierarchy = await SurveyHierarchy.find().sort({ createdAt: 1 });
    res.json(hierarchy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/survey-hierarchy', async (req, res) => {
  try {
    const hierarchyItem = new SurveyHierarchy(req.body);
    await hierarchyItem.save();
    res.status(201).json(hierarchyItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/survey-hierarchy/:id', async (req, res) => {
  try {
    await SurveyHierarchy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hierarchy item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});