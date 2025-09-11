import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HierarchyManagement = () => {
  const [verticals, setVerticals] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [lineOfBusinesses, setLineOfBusinesses] = useState({});
  const [touchpoints, setTouchpoints] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchVerticals();
  }, []);

  const fetchVerticals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hierarchies');
      setVerticals(response.data);
    } catch (error) {
      console.error('Error fetching verticals:', error);
    }
  };

  const fetchLineOfBusinesses = async (verticalId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/hierarchies/${verticalId}/lineofbusiness`);
      setLineOfBusinesses(prev => ({ ...prev, [verticalId]: response.data }));
    } catch (error) {
      console.error('Error fetching line of businesses:', error);
    }
  };

  const fetchTouchpoints = async (lineOfBusinessId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/lineofbusiness/${lineOfBusinessId}/touchpoints`);
      setTouchpoints(prev => ({ ...prev, [lineOfBusinessId]: response.data }));
    } catch (error) {
      console.error('Error fetching touchpoints:', error);
    }
  };

  const toggleExpand = (type, id) => {
    const key = `${type}-${id}`;
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    
    if (type === 'vertical' && !expandedItems[key]) {
      fetchLineOfBusinesses(id);
    } else if (type === 'lob' && !expandedItems[key]) {
      fetchTouchpoints(id);
    }
  };

  const addVertical = async () => {
    if (!newItem.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/hierarchies', { name: newItem, description: '' });
      setNewItem('');
      fetchVerticals();
    } catch (error) {
      console.error('Error adding vertical:', error);
    }
  };

  const addLineOfBusiness = async (verticalId) => {
    if (!newItem.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/hierarchies/${verticalId}/lineofbusiness`, { name: newItem, description: '' });
      setNewItem('');
      fetchLineOfBusinesses(verticalId);
    } catch (error) {
      console.error('Error adding line of business:', error);
    }
  };

  const addTouchpoint = async (lineOfBusinessId) => {
    if (!newItem.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/lineofbusiness/${lineOfBusinessId}/touchpoints`, { name: newItem, description: '' });
      setNewItem('');
      fetchTouchpoints(lineOfBusinessId);
    } catch (error) {
      console.error('Error adding touchpoint:', error);
    }
  };

  const selectItem = (item) => {
    setActiveItem(item);
  };

  const handleAddVertical = () => {
    const name = prompt('Enter Business Vertical name:');
    if (name) {
      setNewItem(name);
      addVertical();
    }
  };

  const handleAddLOB = (verticalId) => {
    const name = prompt('Enter Line of Business name:');
    if (name) {
      setNewItem(name);
      addLineOfBusiness(verticalId);
    }
  };

  const handleAddTouchpoint = (lobId) => {
    const name = prompt('Enter Touchpoint name:');
    if (name) {
      setNewItem(name);
      addTouchpoint(lobId);
    }
  };

  const hierarchyStyles = `
    .main-content { margin-left: 280px; display: flex; height: 100vh; }
    .survey-hierarchy { width: 360px; background: white; border-right: 1px solid #e2e8f0; padding: 24px; overflow-y: auto; }
    .hierarchy-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    .hierarchy-title { font-size: 18px; font-weight: 600; color: #1e293b; }
    .hierarchy-tree { list-style: none; }
    .tree-toggle { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; border-radius: 6px; color: #64748b; font-size: 14px; }
    .tree-toggle:hover { background: #f8fafc; color: #1e293b; }
    .tree-toggle.active { background: #f1f5f9; color: #9333ea; }
    .tree-arrow { width: 12px; font-size: 10px; transition: transform 0.2s ease; color: #94a3b8; }
    .tree-toggle.expanded .tree-arrow { transform: rotate(90deg); }
    .tree-children { list-style: none; margin-left: 24px; display: none; }
    .tree-children.expanded { display: block; }
    .business-vertical { font-weight: 600; color: #1e293b; }
    .add-lob, .add-touchpoint, .add-vertical {
      color: #3b82f6;
      font-size: 13px;
      padding: 6px 12px;
      margin-top: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 4px;
    }
    .add-lob { margin-left: 36px; }
    .add-touchpoint { margin-left: 56px; }
    .add-vertical { margin-left: 0; font-weight: 600; }
    .content-area { flex: 1; padding: 32px; overflow-y: auto; }
  `;

  return (
    <div>
      <style>{hierarchyStyles}</style>
      <div className="main-content">
        <div className="survey-hierarchy">
          <div className="hierarchy-header">
            <h2 className="hierarchy-title">Survey Hierarchy</h2>
          </div>
          <ul className="hierarchy-tree">
            {verticals.map(vertical => (
              <li key={vertical._id} className="tree-item">
                <div 
                  className={`tree-toggle business-vertical ${expandedItems[`vertical-${vertical._id}`] ? 'expanded' : ''}`}
                  onClick={() => toggleExpand('vertical', vertical._id)}
                >
                  <span className="tree-arrow">▶</span>
                  <span>🏪 {vertical.name}</span>
                </div>
                {expandedItems[`vertical-${vertical._id}`] && (
                  <ul className="tree-children expanded">
                    {lineOfBusinesses[vertical._id]?.map(lob => (
                      <li key={lob._id} className="tree-item">
                        <div 
                          className={`tree-toggle ${expandedItems[`lob-${lob._id}`] ? 'expanded' : ''}`}
                          onClick={() => toggleExpand('lob', lob._id)}
                        >
                          <span className="tree-arrow">▶</span>
                          <span>{lob.name}</span>
                        </div>
                        {expandedItems[`lob-${lob._id}`] && (
                          <ul className="tree-children expanded">
                            {touchpoints[lob._id]?.map(touchpoint => (
                              <li key={touchpoint._id} className="tree-item">
                                <div 
                                  className={`tree-toggle ${activeItem === touchpoint._id ? 'active' : ''}`}
                                  onClick={() => selectItem(touchpoint._id)}
                                >
                                  <span style={{width: '12px'}}></span>
                                  <span>{touchpoint.name}</span>
                                </div>
                              </li>
                            ))}
                            <div className="add-touchpoint" onClick={() => handleAddTouchpoint(lob._id)}>
                              <span>⬆</span>Add Touchpoint
                            </div>
                          </ul>
                        )}
                      </li>
                    ))}
                    <div className="add-lob" onClick={() => handleAddLOB(vertical._id)}>
                      <span>➕</span>Add Line of Business
                    </div>
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="add-vertical" onClick={handleAddVertical}>
            <span>➕</span>Add Business Vertical
          </div>
        </div>
        <div className="content-area">
          <h1>Survey Management</h1>
        </div>
      </div>
    </div>
  );
};

export default HierarchyManagement;