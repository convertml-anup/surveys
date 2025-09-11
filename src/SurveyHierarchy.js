import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faBuilding, faIndustry, faUniversity, faHospital, faSchool, faBriefcase, faDollarSign, faCreditCard, faGem, faWrench, faCog, faHammer, faCar, faTruck, faPlane, faShip, faTrain, faPhone, faLaptop, faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

const SurveyHierarchy = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(faStore);
  
  const iconOptions = [
    { icon: faStore, name: "Store" },
    { icon: faBuilding, name: "Building" },
    { icon: faIndustry, name: "Industry" },
    { icon: faUniversity, name: "University" },
    { icon: faHospital, name: "Hospital" },
    { icon: faSchool, name: "School" },
    { icon: faBriefcase, name: "Briefcase" },
    { icon: faDollarSign, name: "Dollar" },
    { icon: faCreditCard, name: "Credit Card" },
    { icon: faGem, name: "Gem" },
    { icon: faWrench, name: "Wrench" },
    { icon: faCog, name: "Cog" },
    { icon: faHammer, name: "Hammer" },
    { icon: faCar, name: "Car" },
    { icon: faTruck, name: "Truck" },
    { icon: faPlane, name: "Plane" },
    { icon: faShip, name: "Ship" },
    { icon: faTrain, name: "Train" },
    { icon: faPhone, name: "Phone" },
    { icon: faLaptop, name: "Laptop" },
    { icon: faChartBar, name: "Chart Bar" },
    { icon: faChartLine, name: "Chart Line" },
    { icon: faChartPie, name: "Chart Pie" }
  ];
  const [hierarchy, setHierarchy] = useState([
    {
      id: Date.now(),
      name: "🏪 Retail",
      type: "vertical",
      expanded: false,
      children: [
        {
          id: Date.now() + 1,
          name: "Two-Wheeler Loan",
          type: "lob",
          expanded: false,
          children: [
            { id: Date.now() + 2, name: "Dealer Walk-In", type: "touchpoint" },
          ],
        },
      ],
    },
  ]);

  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
    setInputValue("");
  };

  const closeModal = () => {
    setShowModal(false);
    setInputValue("");
    setSelectedIcon(faStore);
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    if (modalType === "vertical") {
      setHierarchy([
        ...hierarchy,
        {
          id: Date.now(),
          name: inputValue,
          icon: selectedIcon,
          type: "vertical",
          expanded: false,
          children: [],
        },
      ]);
    } else if (modalType === "lob") {
      addLob(modalData.verticalId, inputValue);
    } else if (modalType === "touchpoint") {
      addTouchpoint(modalData.verticalId, modalData.lobId, inputValue);
    }
    
    closeModal();
  };

  const addVertical = () => {
    openModal("vertical");
  };

  const addLob = (verticalId, name = null) => {
    if (!name) {
      openModal("lob", { verticalId });
      return;
    }
    setHierarchy(
      hierarchy.map((v) =>
        v.id === verticalId
          ? {
              ...v,
              children: [
                ...v.children,
                {
                  id: Date.now(),
                  name,
                  type: "lob",
                  expanded: false,
                  children: [],
                },
              ],
            }
          : v
      )
    );
  };

  const addTouchpoint = (verticalId, lobId, name = null) => {
    if (!name) {
      openModal("touchpoint", { verticalId, lobId });
      return;
    }
    setHierarchy(
      hierarchy.map((v) =>
        v.id === verticalId
          ? {
              ...v,
              children: v.children.map((lob) =>
                lob.id === lobId
                  ? {
                      ...lob,
                      children: [
                        ...lob.children,
                        { id: Date.now(), name, type: "touchpoint" },
                      ],
                    }
                  : lob
              ),
            }
          : v
      )
    );
  };

  const toggleExpand = (id, type) => {
    if (type === "touchpoint") return;
    
    const updateNode = (nodes) => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    
    setHierarchy(updateNode(hierarchy));
  };

  const renderTree = (nodes, level = 0) => {
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {nodes.map((node) => (
          <li key={node.id} className="mb-1">
            <div
              className="tree-toggle flex items-center gap-2 p-2 cursor-pointer rounded text-gray-700 font-medium hover:bg-gray-100"
              style={{ paddingLeft: `${16 + level * 24}px` }}
              onClick={() => toggleExpand(node.id, node.type)}
            >
              {node.type !== "touchpoint" && (
                <span
                  className="tree-arrow text-xs text-gray-400 transition-transform duration-200"
                  style={{
                    transform: node.expanded ? "rotate(90deg)" : "rotate(0deg)"
                  }}
                >
                  ▶
                </span>
              )}
              <span>
                {node.icon && <FontAwesomeIcon icon={node.icon} style={{ marginRight: "8px" }} />}
                {node.name}
              </span>
            </div>

            {node.children && node.children.length > 0 && node.expanded && (
              <div>{renderTree(node.children, level + 1)}</div>
            )}

            {node.type === "lob" && node.expanded && (
              <div
                className="add-touchpoint text-blue-500 text-sm cursor-pointer hover:bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1"
                style={{ paddingLeft: `${40 + level * 24}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  const vertical = hierarchy.find((v) =>
                    v.children.some((lob) => lob.id === node.id)
                  );
                  addTouchpoint(vertical.id, node.id);
                }}
              >
                ⬆ Add Touchpoint
              </div>
            )}

            {node.type === "vertical" && node.expanded && (
              <div
                className="add-lob text-blue-500 text-sm cursor-pointer hover:bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1"
                style={{ paddingLeft: `${40 + level * 24}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  addLob(node.id);
                }}
              >
                ➕ Add Line of Business
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="survey-hierarchy" style={{ width: "384px", backgroundColor: "white", borderRight: "1px solid #e5e7eb", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="hierarchy-header flex justify-between items-center mb-4 pb-2 border-b border-gray-200" style={{ padding: "16px" }}>
        <h2 className="font-semibold text-lg text-gray-800">
          Survey Hierarchy
        </h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {renderTree(hierarchy, 0)}
      </div>

      <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={addVertical}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}
        >
          ➕ Add Business Vertical
        </button>
      </div>
      
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            width: "320px"
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              Add {modalType === "vertical" ? "Business Vertical" : modalType === "lob" ? "Line of Business" : "Touchpoint"}
            </h3>
            {modalType === "vertical" && (
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Icon</label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f9fafb"
                  }}>
                    <FontAwesomeIcon icon={selectedIcon} style={{ fontSize: "16px", color: "#374151" }} />
                  </div>
                  <select
                    value={iconOptions.findIndex(opt => opt.icon === selectedIcon)}
                    onChange={(e) => setSelectedIcon(iconOptions[e.target.value].icon)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      outline: "none",
                      fontSize: "14px"
                    }}
                  >
                    {iconOptions.map((option, index) => (
                      <option key={index} value={index}>{option.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Enter ${modalType === "vertical" ? "Business Vertical" : modalType === "lob" ? "Line of Business" : "Touchpoint"} name`}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                marginBottom: "16px",
                outline: "none"
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={closeModal}
                style={{
                  padding: "8px 16px",
                  color: "#6b7280",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyHierarchy;