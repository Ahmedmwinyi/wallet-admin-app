import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import './AreaTable.scss';
import AreaTableAction from './AreaTableAction';

const TABLE_HEADS = [
  'S/N',
  'FirstName',
  'LastName',
  'MobileNumber',
  'Email',
  'Role',
  'Status',
  'Action',
];

const AreaTable = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const apiKey = localStorage.getItem('key');
        if (!apiKey) {
          console.error('API key is missing from localStorage');
          return;
        }

        const response = await axios.get(`http://localhost:8088/customer/view-all?key=${apiKey}`);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = customers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(customers.length / itemsPerPage);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Customers</h4>
        <div className="filter-buttons">
          <button>Search by Name</button>
          <button>Search by Date</button>
          <button>Search by Mobile Number</button>
        </div>
        <div className="search">
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="data-table-diagram">
        <table className="area-table">
          <thead>
            <tr>
              {TABLE_HEADS.map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index + 1 + offset}</td>
                <td>{customer.firstName}</td>
                <td>{customer.lastName}</td>
                <td>{customer.mobileNumber}</td>
                <td>{customer.email}</td>
                <td>{customer.role}</td>
                <td>{customer.status}</td>
                <td>
                  <AreaTableAction customer={customer} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={1}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
    </section>
  );
};

export default AreaTable;
