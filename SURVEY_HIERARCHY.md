# Survey Hierarchy - MongoDB Integration

## Overview
The Survey Hierarchy feature has been updated to use MongoDB for data persistence instead of localStorage. This ensures data is saved permanently and can be accessed across different sessions and devices.

## Database Schema

### SurveyHierarchy Collection
```javascript
{
  name: String (required),
  icon: String,
  type: String (enum: ['vertical', 'lob', 'touchpoint'], required),
  parentId: ObjectId (reference to parent SurveyHierarchy),
  expanded: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

## API Endpoints

### Get All Hierarchy Items
- **GET** `/api/survey-hierarchy`
- Returns all hierarchy items from the database

### Create Hierarchy Item
- **POST** `/api/survey-hierarchy`
- Body: `{ name, type, parentId?, icon? }`
- Creates a new hierarchy item

### Delete Hierarchy Item
- **DELETE** `/api/survey-hierarchy/:id`
- Deletes a hierarchy item by ID

## Features

1. **Business Verticals**: Top-level hierarchy items with customizable icons
2. **Line of Business**: Second-level items under verticals
3. **Touchpoints**: Third-level items under line of business
4. **Persistent Storage**: All data is saved to MongoDB
5. **Hierarchical Structure**: Maintains parent-child relationships
6. **Icon Support**: Business verticals can have custom FontAwesome icons

## Usage

1. Click "Survey Management" in the sidebar to open the hierarchy panel
2. Add Business Verticals with custom icons
3. Expand verticals to add Lines of Business
4. Expand LOBs to add Touchpoints
5. Click on touchpoints to navigate to survey creation
6. All changes are automatically saved to the database

## Migration from localStorage

The component now:
- Fetches data from MongoDB on load
- Saves new items to MongoDB immediately
- Builds the hierarchy tree from flat database structure
- No longer uses localStorage for persistence