import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import './Footer.scss';

const Footer = () => {
    const [reportType, setReportType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);

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

    const filterDataByDate = (data, startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return data.filter(item => {
            const itemDate = new Date(item.date).getTime();
            return itemDate >= start && itemDate <= end;
        });
    };

    const generateReport = () => {
        const doc = new jsPDF();

        const filteredTransactions = filterDataByDate(transactions, startDate, endDate);
        const filteredCustomers = filterDataByDate(customers, startDate, endDate);

        // Header
        doc.setFontSize(18);
        doc.text('JANU Group of Companies ', 14, 22);
        doc.setFontSize(12);
        doc.text('Wallet Report', 14, 32);
        doc.setFontSize(10);
        doc.text(`Report Type: ${reportType}`, 14, 42);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 52);

        // Summary Information
        if (reportType === 'transactions') {
            const totalTransactions = filteredTransactions.length;
            const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
            doc.text(`Total Transactions: ${totalTransactions}`, 14, 62);
            doc.text(`Total Amount Transacted: TZS ${totalAmount.toFixed(2)}`, 14, 72);
        } else if (reportType === 'customers') {
            const totalCustomers = filteredCustomers.length;
            doc.text(`Total Customers: ${totalCustomers}`, 14, 62);
        }

        // Table data based on report type
        let tableData = [];
        if (reportType === 'transactions') {
            tableData = filteredTransactions.map((transaction, index) => [
                index + 1,
                transaction.walletId,
                transaction.receiver,
                transaction.type,
                `TZS ${transaction.amount}`,
            ]);
        } else if (reportType === 'customers') {
            tableData = filteredCustomers.map((customer, index) => [
                index + 1,
                customer.firstName + " " + customer.lastName,
                customer.email,
                customer.mobileNumber,
            ]);
        }

        // Table
        doc.autoTable({
            head: reportType === 'transactions'
                ? [['ID', 'From', 'To', 'Bill Type', 'Amount']]
                : [['ID', 'Name', 'Email', 'Phone']],
            body: tableData,
            startY: reportType === 'transactions' ? 82 : 72,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { cellPadding: 4, fontSize: 10 },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
        }

        doc.save('report.pdf');
    };

    return (
        <div className="report-container">
            <h2>Generate Report</h2>
            <div className="form-group">
                <label htmlFor="reportType">Report Type</label>
                <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="">Select Report Type</option>
                    <option value="transactions">Transactions</option>
                    <option value="customers">Customers</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="generate-button" onClick={generateReport}>Generate Report</button>
        </div>
    );
};

export default Footer;
