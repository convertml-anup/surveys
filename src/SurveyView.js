import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Survey } from 'survey-react-ui';
import { Snackbar, Alert } from '@mui/material';
import 'survey-core/survey-core.css';

function SurveyView() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/surveys/${id}`);
      setSurvey(response.data);
    } catch (error) {
      console.error('Error fetching survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const onComplete = async (sender) => {
    try {
      await axios.post(`http://localhost:5000/api/surveys/${id}/responses`, sender.data);
      setToast({ open: true, message: 'Thank you for completing the survey!', severity: 'success' });
    } catch (error) {
      console.error('Error saving response:', error);
      setToast({ open: true, message: 'Survey completed, but there was an error saving your response.', severity: 'warning' });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading survey...</h2>
      </div>
    );
  }

  if (!survey) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Survey not found</h2>
        <p>The survey you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  if (!survey.isRunning) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Survey not available</h2>
        <p>This survey is currently not accepting responses.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Survey json={survey.surveyJson} onComplete={onComplete} />
      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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

export default SurveyView;