import React, { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import axios from "axios";
import './AreaCards.scss';

const formatAmount = (amount) => {
  const formatter = new Intl.NumberFormat('en-US');
  return `${formatter.format(amount)} TZS`;
};

const AreaCards = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBillsCount, setTotalBillsCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalTransactionsAmount, setTotalTransactionsAmount] = useState(0);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:8088/bill/admin/view/all?key=${key}`);
        const bills = response.data;

        console.log("Fetched bills:", bills);

        // Calculate total amount and total bills count
        const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
        setTotalAmount(total);
        setTotalBillsCount(bills.length);

        console.log("Total Amount:", total);
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:8088/customer/view-all?key=${key}`);
        const customers = response.data;

        console.log("Fetched customers:", customers);

        setTotalCustomers(customers.length);

      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        const response = await axios.get(`http://localhost:8088/transaction/viewall/admin?key=${key}`);
        const transactions = response.data;

        console.log("Fetched transactions:", transactions);

        // Calculate total transactions amount and count
        const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        setTotalTransactionsAmount(totalAmount);
        setTotalTransactionsCount(transactions.length);

        console.log("Total Transactions Amount:", totalAmount);
        console.log("Total Transactions Count:", transactions.length);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchBills();
    fetchCustomers();
    fetchTransactions();
  }, []);

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Transactions",
          value: formatAmount(totalTransactionsAmount),
          text: `Transactions made: ${totalTransactionsCount}`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "Reg Users",
          value: `${totalCustomers}`,
          text: `Total: ${totalCustomers} Customers`,
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Bills",
          value: formatAmount(totalAmount),
          text: `Total: ${totalBillsCount} Bills.`,
        }}
      />
    </section>
  );
};

export default AreaCards;
