import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AreaProgressChart = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:8088/bill/admin/view/all?key=${key}`);
        const data = response.data;

        console.log("Fetched bills:", data);

        // Assuming the API returns a list of bill objects with relevant fields
        setBills(data.map(bill => ({
          id: bill.id,
          name: bill.billType, // Adjust this based on the actual field in your API response
          percentValues: parseFloat(bill.amount.toFixed(2)) // Format amount to two decimal places
        })));
      } catch (error) {
        console.error("Error fetching bill data:", error);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Recently Paid Bills</h4>
      </div>
      <div className="progress-bar-list">
        {bills.map((bill) => (
          <div className="progress-bar-item" key={bill.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{bill.name}</p>
              <p className="bar-item-info-value">
                {bill.percentValues.toFixed(1)} K
              </p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `${bill.percentValues.toFixed(2) / 100}%`, // Use the formatted value here
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
