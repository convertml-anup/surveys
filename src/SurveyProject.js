import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faTrash, faChartBar, faCopy } from '@fortawesome/free-solid-svg-icons';
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

  return (
    <div className="main-content">
      <h1>Survey Project</h1>
      <p>Manage your survey projects and templates here.</p>
      
      {surveys.length === 0 ? (
        <p>No surveys created yet. Create your first survey!</p>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Total Responses</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey._id} hover>
                  <TableCell>{survey.title}</TableCell>
                  <TableCell>{survey.description}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={survey.responseCount || 0}
                      color={survey.responseCount > 0 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(survey.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(survey.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={survey.isRunning ? 'Stop Survey' : 'Run Survey'}>
                      <IconButton 
                        onClick={() => handleRun(survey)}
                        color={survey.isRunning ? 'error' : 'success'}
                        size="small"
                      >
                        <FontAwesomeIcon icon={survey.isRunning ? faStop : faPlay} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Results">
                      <IconButton 
                        onClick={() => handleResults(survey)}
                        color="primary"
                        size="small"
                      >
                        <FontAwesomeIcon icon={faChartBar} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Shareable URL">
                      <IconButton 
                        onClick={() => handleCopy(survey)}
                        color="default"
                        size="small"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Survey">
                      <IconButton 
                        onClick={() => handleDeleteClick(survey)}
                        color="error"
                        size="small"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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