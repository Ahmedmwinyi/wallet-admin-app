import React, { useState } from 'react';
import './Modal.scss';

const Modal = ({ action, customerData, onClose }) => {
    const [showBills, setShowBills] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);

    const toggleBills = () => setShowBills(!showBills);
    const toggleTransactions = () => setShowTransactions(!showTransactions);

    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{action.charAt(0).toUpperCase() + action.slice(1)} Customer</h2>

                </div>
                <div className="modal-body">
                    {action === 'view' && customerData && (
                        <>
                            <p><strong>First Name:</strong> {customerData.firstName}</p>
                            <p><strong>Last Name:</strong> {customerData.lastName}</p>
                            <p><strong>Mobile Number:</strong> {customerData.mobileNumber}</p>
                            <p><strong>Email:</strong> {customerData.email}</p>
                            <p><strong>Role:</strong> {customerData.role}</p>
                            <h4>Wallet Details:</h4>
                            <p><strong>Wallet ID:</strong> {customerData.wallet.walletId}</p>
                            <p><strong>Balance:</strong> {customerData.wallet.balance}</p>

                            <div className="dropdown-section">
                                <button onClick={toggleBills} className="dropdown-btn">
                                    List of Bills {showBills ? '▲' : '▼'}
                                </button>
                                {showBills && (
                                    <ul className="dropdown-list">
                                        {customerData.wallet.listofBills.map((bill, index) => (
                                            <li key={index}>
                                                <p><strong>Bill ID:</strong> {bill.consumerNo}</p>
                                                <p><strong>Amount:</strong> {bill.amount}</p>
                                                <p><strong>Type of Bill:</strong> {bill.billType}</p>
                                                <p><strong>Date:</strong> {bill.paymentDateTime}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="dropdown-section">
                                <button onClick={toggleTransactions} className="dropdown-btn">
                                    List of Transactions {showTransactions ? '▲' : '▼'}
                                </button>
                                {showTransactions && (
                                    <ul className="dropdown-list">
                                        {customerData.wallet.listofTransactions.map((transaction, index) => (
                                            <li key={index}>
                                                <p><strong>Transaction ID:</strong> {transaction.id}</p>
                                                <p><strong>Amount:</strong> {transaction.amount}</p>
                                                <p><strong>Date:</strong> {transaction.date}</p>
                                                <p><strong>Type:</strong> {transaction.type}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                    {action === 'edit' && <p>Edit customer details here.</p>}
                    {action === 'delete' && <p>Are you sure you want to delete this customer?</p>}
                </div>
                <div className="modal-footer">
                    <button className="modal-action-btn" onClick={onClose}>Close</button>
                    {action === 'delete' && (
                        <button className="modal-action-btn delete-btn" onClick={() => {
                            // Add delete functionality here
                            onClose();
                        }}>Delete</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
