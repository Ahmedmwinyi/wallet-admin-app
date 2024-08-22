import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import Modal from "../../../screens/action/Modal";
import axios from "axios";
import "./AreaTable.scss";

const AreaTableAction = ({ customer }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const dropdownRef = useRef(null);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleModal = async (action) => {
    setModalContent(action);
    if (action === "view") {
      try {
        const apiKey = localStorage.getItem('key');
        const response = await axios.get(`http://localhost:8088/customer/view-mobile?mobileNumber=${customer.mobileNumber}&key=${apiKey}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    }
    setShowModal(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="action-dropdown-btn"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu" ref={dropdownRef}>
            <ul className="dropdown-menu-list">
              <li className="dropdown-menu-item">
                <button
                  className="dropdown-menu-link"
                  onClick={() => handleModal("view")}
                >
                  View
                </button>
              </li>
              <li className="dropdown-menu-item">
                <button
                  className="dropdown-menu-link"
                  onClick={() => handleModal("edit")}
                >
                  Edit
                </button>
              </li>
              <li className="dropdown-menu-item">
                <button
                  className="dropdown-menu-link"
                  onClick={() => handleModal("delete")}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </button>
      {showModal && <Modal action={modalContent} customerData={customerData} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default AreaTableAction;
