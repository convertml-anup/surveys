import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faTrash, faChartBar, faCopy, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';

function SurveyProject() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, survey: null });

  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPath, setSelectedPath] = useState(['Retail', 'Two-Wheeler Loan', 'Dealer Walk-In']);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (survey) => {
    setDeleteDialog({ open: true, survey });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/surveys/${deleteDialog.survey._id}`);
      fetchSurveys();
      setToast({ open: true, message: 'Survey deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting survey:', error);
      setToast({ open: true, message: 'Error deleting survey', severity: 'error' });
    }
    setDeleteDialog({ open: false, survey: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, survey: null });
  };

  const handleRun = async (survey) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/surveys/${survey._id}/toggle`);
      const updatedSurvey = response.data;
      
      setSurveys(prev => prev.map(s => 
        s._id === survey._id ? { ...updatedSurvey, responseCount: s.responseCount } : s
      ));
      
      setToast({ 
        open: true, 
        message: updatedSurvey.isRunning ? `Started survey: ${survey.title}` : `Stopped survey: ${survey.title}`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error toggling survey state:', error);
      setToast({ open: true, message: 'Error updating survey state', severity: 'error' });
    }
  };

  const handleResults = (survey) => {
    navigate(`/survey-results/${survey._id}`);
  };

  const handleCopy = async (survey) => {
    const shareableUrl = `${window.location.origin}/survey/${survey._id}`;
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setToast({ open: true, message: 'Survey URL copied to clipboard!', severity: 'success' });
    } catch (error) {
      console.error('Failed to copy URL:', error);
      setToast({ open: true, message: 'Failed to copy URL', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <h1>Survey Project</h1>
        <p>Loading surveys...</p>
      </div>
    );
  }

  const toggleTreeItem = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const selectTreeItem = (path) => {
    setSelectedPath(path);
  };

  return (
    <div className="survey-management-container">
      <div className="hierarchy-panel">
        <div className="hierarchy-header">
          <h3>Survey Hierarchy</h3>
        </div>
        
        <div className="hierarchy-tree">
            <ul className="tree-root">
              <li className="tree-item">
                <div className={`tree-toggle business-vertical ${expandedItems.retail ? 'expanded' : ''}`} 
                     onClick={() => toggleTreeItem('retail')}>
                  <span className="tree-arrow">▶</span>
                  <span>🏪 Retail</span>
                </div>
                <ul className={`tree-children ${expandedItems.retail ? 'expanded' : ''}`}>
                  <li className="tree-item">
                    <div className={`tree-toggle ${expandedItems.twoWheeler ? 'expanded' : ''}`} 
                         onClick={() => toggleTreeItem('twoWheeler')}>
                      <span className="tree-arrow">▶</span>
                      <span>Two-Wheeler Loan</span>
                    </div>
                    <ul className={`tree-children ${expandedItems.twoWheeler ? 'expanded' : ''}`}>
                      <li className="tree-item">
                        <div className="tree-toggle touchpoint active" 
                             onClick={() => selectTreeItem(['Retail', 'Two-Wheeler Loan', 'Dealer Walk-In'])}>
                          <span>📍 Dealer Walk-In</span>
                        </div>
                      </li>
                      <div className="add-touchpoint">⬆ Add Touchpoint</div>
                    </ul>
                  </li>
                  <li className="tree-item">
                    <div className="tree-toggle" onClick={() => toggleTreeItem('personalLoan')}>
                      <span className="tree-arrow">▶</span>
                      <span>Personal Loan</span>
                    </div>
                    <ul className={`tree-children ${expandedItems.personalLoan ? 'expanded' : ''}`}>
                      <div className="add-touchpoint">⬆ Add Touchpoint</div>
                    </ul>
                  </li>
                  <div className="add-lob">➕ Add Line of Business</div>
                </ul>
              </li>
              
              <li className="tree-item">
                <div className={`tree-toggle business-vertical ${expandedItems.consumer ? 'expanded' : ''}`} 
                     onClick={() => toggleTreeItem('consumer')}>
                  <span className="tree-arrow">▶</span>
                  <span>👥 Consumer</span>
                </div>
                <ul className={`tree-children ${expandedItems.consumer ? 'expanded' : ''}`}>
                  <div className="add-lob">➕ Add Line of Business</div>
                </ul>
              </li>
              
              <li className="tree-item">
                <div className={`tree-toggle business-vertical ${expandedItems.commercial ? 'expanded' : ''}`} 
                     onClick={() => toggleTreeItem('commercial')}>
                  <span className="tree-arrow">▶</span>
                  <span>🏢 Commercial</span>
                </div>
                <ul className={`tree-children ${expandedItems.commercial ? 'expanded' : ''}`}>
                  <div className="add-lob">➕ Add Line of Business</div>
                </ul>
              </li>
            </ul>
        </div>
      </div>

      <div className="content-area">
        <div className="breadcrumb">
          {selectedPath.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item}</span>
              {index < selectedPath.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="content-header">
          <h1>Survey Management</h1>
          <button className="add-survey-btn">Add Survey</button>
        </div>
      
        {surveys.length === 0 ? (
          <p>No surveys created yet. Create your first survey!</p>
        ) : (
          <div className="survey-table">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Survey Name</th>
                    <th>Status</th>
                    <th>Last Modified</th>
                    <th>Template</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr key={survey._id}>
                      <td className="survey-name">{survey.title}</td>
                      <td>
                        <span className={`status-badge ${survey.isRunning ? 'status-active' : 'status-draft'}`}>
                          <span className="status-dot"></span>
                          {survey.isRunning ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td>{new Date(survey.updatedAt).toLocaleDateString()}</td>
                      <td>{survey.description || 'Custom Template'}</td>
                      <td>
                        <div className="action-buttons">
                          <Tooltip title={survey.isRunning ? 'Stop Survey' : 'Run Survey'}>
                            <button 
                              className={`action-btn ${survey.isRunning ? '' : 'primary'}`}
                              onClick={() => handleRun(survey)}
                            >
                              {survey.isRunning ? 'Stop' : 'Run'}
                            </button>
                          </Tooltip>
                          <Tooltip title="View Results">
                            <button className="action-btn" onClick={() => handleResults(survey)}>
                              Results
                            </button>
                          </Tooltip>
                          <Tooltip title="Copy Shareable URL">
                            <button className="action-btn" onClick={() => handleCopy(survey)}>
                              Copy
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete Survey">
                            <button className="action-btn delete" onClick={() => handleDeleteClick(survey)}>
                              Delete
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
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
      
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Survey</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.survey?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SurveyProject;