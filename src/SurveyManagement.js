import React from 'react';
import SurveyHierarchy from './SurveyHierarchy';

function SurveyManagement() {
  return (
    <div className="main-content" style={{ marginLeft: '280px', padding: 0, display: 'flex' }}>
      <SurveyHierarchy />
      <div style={{ flex: 1, padding: '40px 48px' }}>
        <h1>Survey Management</h1>
        <p>Select a touchpoint from the hierarchy to manage surveys.</p>
      </div>
    </div>
  );
}

export default SurveyManagement;