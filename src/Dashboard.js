import React from 'react';

function Dashboard() {
  return (
    <div className="main-content">
      <div className="decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="welcome-header">
        <h1 className="welcome-title">Welcome</h1>
        <p className="welcome-subtitle">Transform feedback into actionable insights that drive real business growth and customer satisfaction</p>
      </div>

      <div className="quick-start">
        <div className="quick-start-content">
          <h2>Ready to unlock powerful insights?</h2>
          <p>Create your first survey in under 3 minutes and start collecting valuable feedback from your audience</p>
          <button className="cta-button">🚀 Create Your First Survey</button>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card surveys">
          <div className="feature-icon">📝</div>
          <h3 className="feature-title">Surveys</h3>
          <p className="feature-description">Create engaging surveys with smart logic, custom branding, and multi-channel distribution to maximize response rates</p>
          <div className="feature-stats">
            <div className="stat">
              <span>⚡</span>
              <span>3 min setup</span>
            </div>
            <div className="stat">
              <span>📱</span>
              <span>Mobile optimized</span>
            </div>
          </div>
        </div>

        <div className="feature-card analytics">
          <div className="feature-icon">📊</div>
          <h3 className="feature-title">Analytics</h3>
          <p className="feature-description">Turn raw data into compelling visualizations and actionable insights with real-time dashboards and trend analysis</p>
          <div className="feature-stats">
            <div className="stat">
              <span>⏱️</span>
              <span>Real-time data</span>
            </div>
            <div className="stat">
              <span>📈</span>
              <span>Smart insights</span>
            </div>
          </div>
        </div>

        <div className="feature-card segmentation">
          <div className="feature-icon">🎯</div>
          <h3 className="feature-title">Segmentation</h3>
          <p className="feature-description">Build dynamic audience segments with advanced filtering and automated alerts to target the right message to the right people</p>
          <div className="feature-stats">
            <div className="stat">
              <span>🔄</span>
              <span>Auto-update</span>
            </div>
            <div className="stat">
              <span>🎯</span>
              <span>Precision targeting</span>
            </div>
          </div>
        </div>

        <div className="feature-card reporting">
          <div className="feature-icon">📋</div>
          <h3 className="feature-title">Reporting</h3>
          <p className="feature-description">Generate professional presentations and detailed reports that tell your data's story with compelling visuals and key findings</p>
          <div className="feature-stats">
            <div className="stat">
              <span>🎨</span>
              <span>Custom branded</span>
            </div>
            <div className="stat">
              <span>📤</span>
              <span>One-click export</span>
            </div>
          </div>
        </div>

        <div className="feature-card callbacks">
          <div className="feature-icon">📞</div>
          <h3 className="feature-title">Callbacks</h3>
          <p className="feature-description">Automate intelligent follow-ups and personalized outreach based on survey responses to close the feedback loop</p>
          <div className="feature-stats">
            <div className="stat">
              <span>🤖</span>
              <span>Smart automation</span>
            </div>
            <div className="stat">
              <span>💬</span>
              <span>Personal touch</span>
            </div>
          </div>
        </div>

        <div className="feature-card resources">
          <div className="feature-icon">🎓</div>
          <h3 className="feature-title">Resources & Support</h3>
          <p className="feature-description">Access comprehensive guides, best practices, and expert support to maximize your survey success and ROI</p>
          <div className="feature-stats">
            <div className="stat">
              <span>📖</span>
              <span>Learning center</span>
            </div>
            <div className="stat">
              <span>🎧</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="get-started-section">
        <h2>Let's build something amazing together</h2>
        <p>Whether you're gathering customer feedback, conducting market research, or measuring employee satisfaction, ConvertML has the tools you need to succeed.</p>
        <div className="action-buttons">
          <button className="btn-primary">🚀 Start Creating</button>
          <button className="btn-secondary">📖 View Documentation</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;