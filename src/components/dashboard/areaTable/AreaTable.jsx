import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AreaTable.scss';

const TABLE_HEADS = [
  "S/N",
  "FirstName",
  "LastName",
  "MobileNumber",
  "Email",
  "Role",
  "Status"
];

const AreaTable = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:8088/customer/view-all?key=${key}`);
        const data = response.data;

        console.log("Fetched customers:", data);

        // Assuming the API returns a list of customer objects
        setCustomers(data.slice(0, 5)); // Displaying only the first 5 customers
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Customers</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.mobileNumber}</td>
                <td>{dataItem.firstName}</td>
                <td>{dataItem.lastName}</td>
                <td>{dataItem.mobileNumber}</td>
                <td>{dataItem.email}</td>
                <td>{dataItem.role}</td>
                <td>
                  <div className="dt-status">
                    <span
                      className={`dt-status-dot dot-${dataItem.status ? dataItem.status.toLowerCase() : 'unknown'}`}
                    ></span>
                    <span className="dt-status-text">
                      {dataItem.status || 'Unknown'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
