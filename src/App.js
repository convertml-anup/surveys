import React, { useState, useEffect } from 'react';
import './styles.css';
import Dashboard from './Dashboard';
 import 'survey-core/survey-core.css';
import 'survey-creator-core/survey-creator-core.css';
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";

const surveyJson = {
    title: "Customer Satisfaction Survey",
    description: "Help us improve by sharing your feedback",
    showProgressBar: "top",
    showQuestionNumbers: "off",
    completedHtml: "<h3>Thank you for your feedback!</h3>",
    pages: [{
        name: "satisfaction",
        title: "Overall Satisfaction",
        elements: [{
            name: "satisfaction-score",
            title: "How satisfied are you with our service?",
            type: "rating",
            rateMax: 5,
            rateMin: 1,
            minRateDescription: "Very Dissatisfied",
            maxRateDescription: "Very Satisfied",
            isRequired: true
        }]
    }, {
        name: "high-satisfaction",
        title: "Additional Feedback",
        elements: [{
            name: "what-would-make-you-more-satisfied",
            title: "What would make you more satisfied?",
            type: "comment",
            placeholder: "Please share your thoughts...",
            visibleIf: "{satisfaction-score} = 4"
        }, {
            name: "nps-score",
            title: "How likely are you to recommend us to others?",
            type: "rating",
            rateMax: 10,
            rateMin: 0,
            minRateDescription: "Not at all likely",
            maxRateDescription: "Extremely likely",
            isRequired: true
        }],
        visibleIf: "{satisfaction-score} >= 4"
    }, {
        name: "neutral-satisfaction",
        title: "Help Us Improve",
        elements: [{
            name: "how-can-we-improve",
            title: "How can we improve our service?",
            type: "comment",
            placeholder: "Your suggestions are valuable to us...",
            isRequired: true
        }],
        visibleIf: "{satisfaction-score} = 3"
    }, {
        name: "low-satisfaction",
        title: "We're Sorry",
        elements: [{
            name: "disappointing-experience",
            title: "What was disappointing about your experience?",
            type: "comment",
            placeholder: "Please help us understand what went wrong...",
            isRequired: true
        }, {
            name: "contact-follow-up",
            title: "Would you like us to contact you about this issue?",
            type: "boolean",
            labelTrue: "Yes, please contact me",
            labelFalse: "No, thank you"
        }],
        visibleIf: "{satisfaction-score} <= 2"
    }]
};
function App({ config = {} }) {
  const [expandedMenus, setExpandedMenus] = useState({ 'Surveys': true });
  const [activeSubMenuItem, setActiveSubMenuItem] = useState('Create Survey');
  const [showSurveys, setShowSurveys] = useState(false);


  const [showSurveyCreator, setShowSurveyCreator] = React.useState(false);
  const creator = new SurveyCreator();
  
  // Use provided survey JSON or default
  const finalSurveyJson = config.surveyJson || surveyJson;
  creator.JSON = finalSurveyJson;
  
  // Apply configuration options
  if (config.onSurveyComplete) {
    creator.onSurveyInstanceCreated.add((sender, options) => {
      options.survey.onComplete.add(config.onSurveyComplete);
    });
  }
  
  const toggleSubMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [menuName]: !prev[menuName]
    }));
  };

  const handleSubMenuClick = (item) => {
    setActiveSubMenuItem(item);
    if (item === 'Create Survey') {
      setShowSurveys(true);
    } else if (item === 'Dashboard') {
      setShowSurveys(false);
    }
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">📊</div>
          <div className="logo-text">ConvertML</div>
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Surveys'] ? 'expanded' : ''} active`} onClick={() => toggleSubMenu('Surveys')}>
                <span className="nav-icon">📋</span>
                Surveys
              </div>
              <ul className={`sub-menu ${expandedMenus['Surveys'] ? 'expanded' : ''}`}>
                {['Create Survey', 'Survey Library', 'Survey Distribution', 'Survey Responses', 'Survey Settings'].map(item => (
                  <li key={item} className={`sub-menu-item ${activeSubMenuItem === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Analytics'] ? 'expanded' : ''}`} onClick={() => toggleSubMenu('Analytics')}>
                <span className="nav-icon">📊</span>
                Analytics
              </div>
              <ul className={`sub-menu ${expandedMenus['Analytics'] ? 'expanded' : ''}`}>
                {['Dashboard', 'Reports Generation', 'Segmentation & Take Action'].map(item => (
                  <li key={item} className={`sub-menu-item ${activeSubMenuItem === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Callbacks'] ? 'expanded' : ''}`} onClick={() => toggleSubMenu('Callbacks')}>
                <span className="nav-icon">📞</span>
                Callbacks
              </div>
              <ul className={`sub-menu ${expandedMenus['Callbacks'] ? 'expanded' : ''}`}>
                {['Callback Requests', 'Callback Scheduler', 'Call History'].map(item => (
                  <li key={item} className={`sub-menu-item ${activeSubMenuItem === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Resources'] ? 'expanded' : ''}`} onClick={() => toggleSubMenu('Resources')}>
                <span className="nav-icon">📚</span>
                Resources
              </div>
              <ul className={`sub-menu ${expandedMenus['Resources'] ? 'expanded' : ''}`}>
                {['Guides & Tutorials', 'Help Center', 'Community & Support'].map(item => (
                  <li key={item} className={`sub-menu-item ${activeSubMenuItem === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Settings'] ? 'expanded' : ''}`} onClick={() => toggleSubMenu('Settings')}>
                <span className="nav-icon">⚙️</span>
                Settings
              </div>
              <ul className={`sub-menu ${expandedMenus['Settings'] ? 'expanded' : ''}`}>
                {['User Profile', 'Team Management', 'Integrations', 'Billing & Usage'].map(item => (
                  <li key={item} className={`sub-menu-item ${activeSubMenuItem === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      {showSurveys ? (
        <div className="main-content">  <SurveyCreatorComponent creator={creator} /> </div>
      ) : <Dashboard />}
    </div>
  );
}

export default App;