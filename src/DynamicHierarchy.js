import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DynamicHierarchy = () => {
  const [nodes, setNodes] = useState({});
  const [expanded, setExpanded] = useState({});
  const [showAdd, setShowAdd] = useState({});
  const [newNode, setNewNode] = useState({ name: '', description: '' });

  const levelNames = ['Level 1', 'Level 2', 'Level 3'];

  useEffect(() => {
    fetchNodes(1);
  }, []);

  const fetchNodes = async (level, parentId = null) => {
    try {
      const params = { level };
      if (parentId) params.parentId = parentId;
      
      const response = await axios.get('http://localhost:5000/api/hierarchy', { params });
      const key = parentId || 'root';
      setNodes(prev => ({ ...prev, [key]: response.data }));
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const addNode = async (level, parentId = null) => {
    try {
      const nodeData = { ...newNode, level };
      if (parentId) nodeData.parentId = parentId;
      
      await axios.post('http://localhost:5000/api/hierarchy', nodeData);
      setNewNode({ name: '', description: '' });
      setShowAdd({});
      fetchNodes(level, parentId);
    } catch (error) {
      console.error('Error adding node:', error);
    }
  };

  const deleteNode = async (id, level, parentId = null) => {
    if (window.confirm('Delete this item and all children?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hierarchy/${id}`);
        fetchNodes(level, parentId);
      } catch (error) {
        console.error('Error deleting node:', error);
      }
    }
  };

  const toggleExpand = (id, level) => {
    const key = `${level}-${id}`;
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    if (!expanded[key] && level < 3) {
      fetchNodes(level + 1, id);
    }
  };

  const renderNodes = (nodeList, level, parentId = null) => {
    if (!nodeList) return null;

    return nodeList.map(node => (
      <div key={node._id} className="hierarchy-node">
        <div className="node-header">
          {level < 3 && (
            <button 
              className="expand-btn"
              onClick={() => toggleExpand(node._id, level)}
            >
              <FontAwesomeIcon icon={expanded[`${level}-${node._id}`] ? faChevronDown : faChevronRight} />
            </button>
          )}
          <div className="node-content">
            <h4>{node.name}</h4>
            {node.description && <p>{node.description}</p>}
          </div>
          <div className="node-actions">
            {level < 3 && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAdd({ [`${level + 1}-${node._id}`]: true })}
              >
                <FontAwesomeIcon icon={faPlus} /> Add {levelNames[level]}
              </button>
            )}
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => deleteNode(node._id, level, parentId)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>

        {showAdd[`${level + 1}-${node._id}`] && (
          <div className="add-form nested">
            <h5>Add {levelNames[level]}</h5>
            <input
              type="text"
              placeholder="Name"
              value={newNode.name}
              onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newNode.description}
              onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
            />
            <div className="form-actions">
              <button className="btn btn-primary" onClick={() => addNode(level + 1, node._id)}>Add</button>
              <button className="btn btn-secondary" onClick={() => setShowAdd({})}>Cancel</button>
            </div>
          </div>
        )}

        {expanded[`${level}-${node._id}`] && level < 3 && (
          <div className="nested-nodes">
            {renderNodes(nodes[node._id], level + 1, node._id)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="main-content">
      <div className="hierarchy-management">
        <div className="header-section">
          <h2>Dynamic Survey Hierarchy</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAdd({ '1-root': true })}
          >
            <FontAwesomeIcon icon={faPlus} /> Add {levelNames[0]}
          </button>
        </div>

        {showAdd['1-root'] && (
          <div className="add-form">
            <h3>Add {levelNames[0]}</h3>
            <input
              type="text"
              placeholder="Name"
              value={newNode.name}
              onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newNode.description}
              onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
            />
            <div className="form-actions">
              <button className="btn btn-primary" onClick={() => addNode(1)}>Add</button>
              <button className="btn btn-secondary" onClick={() => setShowAdd({})}>Cancel</button>
            </div>
          </div>
        )}

        <div className="hierarchy-tree">
          {renderNodes(nodes.root, 1)}
        </div>
      </div>
    </div>
  );
};

export default DynamicHierarchy;