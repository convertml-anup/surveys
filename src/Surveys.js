import React from 'react';

function Surveys() {
  return (
    <div className="main-content">
      <div className="welcome-header">
        <h1 className="welcome-title">Surveys</h1>
        <p className="welcome-subtitle">Create, manage, and distribute surveys to collect valuable feedback</p>
      </div>

      <div className="quick-start">
        <div className="quick-start-content">
          <h2>Create Your Survey</h2>
          <p>Build engaging surveys with our intuitive drag-and-drop interface</p>
          <button className="cta-button">📝 New Survey</button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card surveys">
          <div className="feature-icon">📝</div>
          <h3 className="feature-title">Create Survey</h3>
          <p className="feature-description">Build custom surveys with various question types and smart logic</p>
        </div>

        <div className="feature-card analytics">
          <div className="feature-icon">📚</div>
          <h3 className="feature-title">Survey Library</h3>
          <p className="feature-description">Access pre-built templates and manage your survey collection</p>
        </div>

        <div className="feature-card segmentation">
          <div className="feature-icon">📤</div>
          <h3 className="feature-title">Distribution</h3>
          <p className="feature-description">Share surveys via email, social media, or embed on websites</p>
        </div>

        <div className="feature-card reporting">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Responses</h3>
          <p className="feature-description">View and analyze survey responses in real-time</p>
        </div>
      </div>
    </div>
  );
}

export default Surveys;