import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  Collapse,
  IconButton,
  TextField,
  Grid,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faSearch } from '@fortawesome/free-solid-svg-icons';

function SurveyResults() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [surveyResponse, responsesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/surveys/${id}`),
        axios.get(`http://localhost:5000/api/surveys/${id}/responses`)
      ]);
      setSurvey(surveyResponse.data);
      setResponses(responsesResponse.data);
      setFilteredResponses(responsesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (responseId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredResponses(responses);
    } else {
      const filtered = responses.filter(response => 
        JSON.stringify(response.responses).toLowerCase().includes(term) ||
        new Date(response.submittedAt).toLocaleString().toLowerCase().includes(term)
      );
      setFilteredResponses(filtered);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <h1>Loading survey results...</h1>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="main-content">
        <h1>Survey not found</h1>
        <p>The survey results you're looking for don't exist.</p>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>Survey Results: {survey.title}</h1>
      <p>{survey.description}</p>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">Total Responses</Typography>
              <Typography variant="h4">{responses.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary">Survey Status</Typography>
              <Chip 
                label={survey.isRunning ? 'Active' : 'Stopped'} 
                color={survey.isRunning ? 'success' : 'default'}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info">Created</Typography>
              <Typography>{new Date(survey.createdAt).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning">Last Updated</Typography>
              <Typography>{new Date(survey.updatedAt).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {responses.length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Individual Responses ({filteredResponses.length})</Typography>
            <TextField
              size="small"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <FontAwesomeIcon icon={faSearch} style={{ marginRight: '8px', color: '#666' }} />
              }}
              sx={{ width: 300 }}
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="50"></TableCell>
                  <TableCell>Response #</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>Preview</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResponses.map((response, index) => (
                  <React.Fragment key={response._id}>
                    <TableRow hover>
                      <TableCell>
                        <Tooltip title={expandedRows.has(response._id) ? 'Collapse' : 'Expand'}>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleRowExpansion(response._id)}
                          >
                            <FontAwesomeIcon 
                              icon={expandedRows.has(response._id) ? faChevronUp : faChevronDown} 
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip label={index + 1} color="primary" size="small" />
                      </TableCell>
                      <TableCell>
                        {new Date(response.submittedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          maxWidth: 300, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {Object.keys(response.responses).length} answer(s)
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ p: 0 }}>
                        <Collapse in={expandedRows.has(response._id)}>
                          <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                            <Typography variant="subtitle2" gutterBottom>Response Details:</Typography>
                            {Object.entries(response.responses).map(([key, value]) => (
                              <Box key={key} sx={{ mb: 1 }}>
                                <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                  {key}:
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3cd', borderRadius: 1 }}>
          <Typography>No responses yet. Share your survey to start collecting responses!</Typography>
        </Box>
      )}
    </div>
  );
}

export default SurveyResults;