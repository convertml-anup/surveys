import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faClipboardList, faPhone, faBook, faCog, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import './styles.css';
import Dashboard from './Dashboard';
import SurveyAnalytics from './SurveyAnalytics';
import SurveyProject from './SurveyProject';
import SurveyView from './SurveyView';
import SurveyResults from './SurveyResults';
import SurveyHierarchy from './SurveyHierarchy';
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
function SurveyCreatorPage({ config = {} }) {
  const location = useLocation();
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState(location.state?.verticalId || '');
  const [selectedLob, setSelectedLob] = useState(location.state?.lobId || '');
  const [selectedTouchpoint, setSelectedTouchpoint] = useState(location.state?.touchpointId || '');
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  
  const creator = new SurveyCreator();
  const finalSurveyJson = config.surveyJson || surveyJson;
  creator.JSON = finalSurveyJson;
  
  React.useEffect(() => {
    fetchHierarchy();
  }, []);
  
  React.useEffect(() => {
    if (location.state?.verticalId) {
      setSelectedVertical(location.state.verticalId);
    }
    if (location.state?.lobId) {
      setSelectedLob(location.state.lobId);
    }
    if (location.state?.touchpointId) {
      setSelectedTouchpoint(location.state.touchpointId);
    }
  }, [hierarchy, location.state]);
  
  const fetchHierarchy = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/survey-hierarchy');
      setHierarchy(buildHierarchyTree(response.data));
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    }
  };
  
  const buildHierarchyTree = (flatData) => {
    const tree = [];
    const map = {};
    
    flatData.forEach(item => {
      map[item._id] = { ...item, id: item._id, children: [] };
    });
    
    flatData.forEach(item => {
      if (item.parentId) {
        if (map[item.parentId]) {
          map[item.parentId].children.push(map[item._id]);
        }
      } else {
        tree.push(map[item._id]);
      }
    });
    
    return tree;
  };
  
  const getLobOptions = () => {
    const vertical = hierarchy.find(v => v.id === selectedVertical);
    return vertical ? vertical.children : [];
  };
  
  const getTouchpointOptions = () => {
    const vertical = hierarchy.find(v => v.id === selectedVertical);
    if (!vertical) return [];
    const lob = vertical.children.find(l => l.id === selectedLob);
    return lob ? lob.children : [];
  };
  
  creator.saveSurveyFunc = async (saveNo, callback) => {
    if (!selectedTouchpoint) {
      setShowHierarchyModal(true);
      callback(saveNo, false);
      return;
    }
    
    try {
      const surveyData = {
        title: creator.JSON.title || 'Untitled Survey',
        description: creator.JSON.description || '',
        surveyJson: creator.JSON,
        verticalId: selectedVertical,
        lobId: selectedLob,
        touchpointId: selectedTouchpoint
      };
      
      await axios.post('http://localhost:5000/api/surveys', surveyData);
      callback(saveNo, true);
      setToast({ open: true, message: 'Survey saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error saving survey:', error);
      callback(saveNo, false);
      setToast({ open: true, message: 'Error saving survey', severity: 'error' });
    }
  };
  
  if (config.onSurveyComplete) {
    creator.onSurveyInstanceCreated.add((sender, options) => {
      options.survey.onComplete.add(config.onSurveyComplete);
    });
  }
  
  return (
    <div className="main-content">
      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Survey Location</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select
            value={selectedVertical}
            onChange={(e) => {
              setSelectedVertical(e.target.value);
              setSelectedLob('');
              setSelectedTouchpoint('');
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">Select Business Vertical</option>
            {hierarchy.map(vertical => (
              <option key={vertical.id} value={vertical.id}>{vertical.name}</option>
            ))}
          </select>
          
          <select
            value={selectedLob}
            onChange={(e) => {
              setSelectedLob(e.target.value);
              setSelectedTouchpoint('');
            }}
            disabled={!selectedVertical}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">Select Line of Business</option>
            {getLobOptions().map(lob => (
              <option key={lob.id} value={lob.id}>{lob.name}</option>
            ))}
          </select>
          
          <select
            value={selectedTouchpoint}
            onChange={(e) => setSelectedTouchpoint(e.target.value)}
            disabled={!selectedLob}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="">Select Touchpoint</option>
            {getTouchpointOptions().map(touchpoint => (
              <option key={touchpoint.id} value={touchpoint.id}>{touchpoint.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <SurveyCreatorComponent creator={creator} />
      
      {showHierarchyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Survey Location Required</h3>
            <p style={{ marginBottom: '20px' }}>Please select a Business Vertical, Line of Business, and Touchpoint before saving the survey.</p>
            <button
              onClick={() => setShowHierarchyModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({ 'Surveys': true });
  const [showHierarchy, setShowHierarchy] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);


  
  const toggleSubMenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [menuName]: !prev[menuName]
    }));
  };

  const getActiveSubMenuItem = () => {
    if (location.pathname === '/create-survey') return 'Create Survey';
    if (location.pathname === '/survey-management') return 'Survey Management';
    if (location.pathname === '/survey-project') return 'Survey Management';
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/survey-analytics') return 'Survey Analytics';
    return 'Dashboard';
  };

  const handleSubMenuClick = (item) => {
    if (item === 'Create Survey') {
      navigate('/create-survey');
    } else if (item === 'Survey Management') {
      setShowHierarchy(!showHierarchy);
    } else if (item === 'Dashboard') {
      navigate('/dashboard');
    } else if (item === 'Survey Analytics') {
      navigate('/survey-analytics');
    }
  };

  return (
    <div>
      <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-header">
          <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon"><FontAwesomeIcon icon={faChartBar} /></div>
            {!isMinimized && <div className="logo-text">ConvertML</div>}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
          >
            <FontAwesomeIcon icon={isMinimized ? faChevronRight : faChevronLeft} />
          </button>
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Surveys'] ? 'expanded' : ''} active`} onClick={() => !isMinimized && toggleSubMenu('Surveys')} title="Surveys">
                <span className="nav-icon"><FontAwesomeIcon icon={faClipboardList} /></span>
                {!isMinimized && 'Surveys'}
              </div>
              {!isMinimized && (
                <ul className={`sub-menu ${expandedMenus['Surveys'] ? 'expanded' : ''}`}>
                  {['Survey Management', 'Survey Distribution', 'Survey Responses', 'Survey Settings'].map(item => (
                    <li key={item} className={`sub-menu-item ${getActiveSubMenuItem() === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Analytics'] ? 'expanded' : ''}`} onClick={() => !isMinimized && toggleSubMenu('Analytics')} title="Analytics">
                <span className="nav-icon"><FontAwesomeIcon icon={faChartBar} /></span>
                {!isMinimized && 'Analytics'}
              </div>
              {!isMinimized && (
                <ul className={`sub-menu ${expandedMenus['Analytics'] ? 'expanded' : ''}`}>
                  {['Dashboard', 'Survey Analytics', 'Reports Generation', 'Segmentation & Take Action'].map(item => (
                    <li key={item} className={`sub-menu-item ${getActiveSubMenuItem() === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Callbacks'] ? 'expanded' : ''}`} onClick={() => !isMinimized && toggleSubMenu('Callbacks')} title="Callbacks">
                <span className="nav-icon"><FontAwesomeIcon icon={faPhone} /></span>
                {!isMinimized && 'Callbacks'}
              </div>
              {!isMinimized && (
                <ul className={`sub-menu ${expandedMenus['Callbacks'] ? 'expanded' : ''}`}>
                  {['Callback Requests', 'Callback Scheduler', 'Call History'].map(item => (
                    <li key={item} className={`sub-menu-item ${getActiveSubMenuItem() === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Resources'] ? 'expanded' : ''}`} onClick={() => !isMinimized && toggleSubMenu('Resources')} title="Resources">
                <span className="nav-icon"><FontAwesomeIcon icon={faBook} /></span>
                {!isMinimized && 'Resources'}
              </div>
              {!isMinimized && (
                <ul className={`sub-menu ${expandedMenus['Resources'] ? 'expanded' : ''}`}>
                  {['Guides & Tutorials', 'Help Center', 'Community & Support'].map(item => (
                    <li key={item} className={`sub-menu-item ${getActiveSubMenuItem() === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-item">
              <div className={`nav-link has-children ${expandedMenus['Settings'] ? 'expanded' : ''}`} onClick={() => !isMinimized && toggleSubMenu('Settings')} title="Settings">
                <span className="nav-icon"><FontAwesomeIcon icon={faCog} /></span>
                {!isMinimized && 'Settings'}
              </div>
              {!isMinimized && (
                <ul className={`sub-menu ${expandedMenus['Settings'] ? 'expanded' : ''}`}>
                  {['User Profile', 'Team Management', 'Integrations', 'Billing & Usage'].map(item => (
                    <li key={item} className={`sub-menu-item ${getActiveSubMenuItem() === item ? 'active' : ''}`} onClick={() => handleSubMenuClick(item)}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {showHierarchy && (
        <div style={{
          position: 'fixed',
          left: isMinimized ? '60px' : '280px',
          top: '0',
          width: '384px',
          height: '100vh',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          zIndex: 1000,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}>
          <SurveyHierarchy onClose={() => setShowHierarchy(false)} />
        </div>
      )}
    </div>
  );
}

function AppContent({ config }) {
  const location = useLocation();
  const isSurveyView = location.pathname.startsWith('/survey/');
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  return (
    <div className={sidebarMinimized ? 'sidebar-minimized' : ''}>
      {!isSurveyView && <Sidebar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-survey" element={<SurveyCreatorPage config={config} />} />

        <Route path="/survey-project" element={<SurveyProject />} />
        <Route path="/survey-analytics" element={<SurveyAnalytics />} />
        <Route path="/survey/:id" element={<SurveyView />} />
        <Route path="/survey-results/:id" element={<SurveyResults />} />
      </Routes>
    </div>
  );
}

function App({ config = {} }) {
  return (
    <Router>
      <AppContent config={config} />
    </Router>
  );
}

export default App;