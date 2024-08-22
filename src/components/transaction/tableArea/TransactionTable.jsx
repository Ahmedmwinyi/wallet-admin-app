/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import AreaTableAction from './AreaTableAction';
import './TransactionFilterBar.scss';
import axios from 'axios';

const TABLE_HEADS = [
  'ID',
  'Sender',
  'Receiver',
  'Amount',
  'Type',
  'Time',
  'Date',
  'Description',
  'Action',
];

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('none');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const sessionKey = localStorage.getItem('key');
        if (!sessionKey) {
          console.error('Session Key is not found in the localStorage');
          return;
        }

        const response = await axios.get(`http://localhost:8088/transaction/viewall/admin?key=${sessionKey}`);
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchTransaction();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  }

  const offset = currentPage * itemsPerPage;
  const currentPageData = transactions.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(transactions.length / itemsPerPage);

  return (
    <section className="content-area-table">
      <div className="transaction-filter-bar">
        <input 
          type='text'
          placeholder='Search transaction...'
        />
        <select>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select >
          <option value="last30days">Last 30 Days</option>
          <option value="last7days">Last 7 Days</option>
          <option value="today">Today</option>
          <option value="custom">Custom Range</option>
        </select>
        <select>
          <option value="0-1000">$0 - $1000</option>
          <option value="1000-5000">$1000 - $5000</option>
          <option value="5000+">$5000+</option>
        </select>
        <select>
          <option value="all">All</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="transfer">Transfer</option>
        </select>
        <button>Apply Filters</button>
      </div>

      <div className="data-table-info">
        <h4 className="data-table-title">Customers List</h4>
        <div className="filter-buttons">
          <button>Filter by Name</button>
          <button>Filter by Date</button>
          <button>Filter by Amount</button>
        </div>
        <div className="search">
          <input 
            type="text"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {
                TABLE_HEADS.map((th, index) => (
                  <th key={index}> {th} </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              currentPageData.map((transactions, index) => (
                <tr key={transactions.transactionId}>
                  <td>{index + 1 + offset}</td>
                  <td>{transactions.walletId}</td>
                  <td>{transactions.receiver}</td>
                  <td>{transactions.amount}</td>
                  <td>{transactions.type}</td>
                  <td>{transactions.time}</td>
                  <td>{transactions.date}</td>
                  <td>{transactions.description}</td>
                  <td>
                    <AreaTableAction transactions={transactions} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TransactionTable