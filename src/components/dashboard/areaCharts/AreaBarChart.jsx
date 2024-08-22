import React, { useEffect, useState, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaCharts.scss";

// Function to format numbers with commas
const formatNumber = (value) => new Intl.NumberFormat().format(value);

// Function to get the month in a consistent format
const getMonth = (date) => new Date(date).toLocaleString('default', { month: 'short' });

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = localStorage.getItem('key');
        if (!key) {
          console.error("Key not found in local storage");
          return;
        }

        // Fetch bills and transactions data
        const billsResponse = await axios.get(`http://localhost:8088/bill/admin/view/all?key=${key}`);
        const transactionsResponse = await axios.get(`http://localhost:8088/transaction/viewall/admin?key=${key}`);

        const bills = billsResponse.data;
        const transactions = transactionsResponse.data;

        // Log raw data
        console.log("Fetched bills:", bills);
        console.log("Fetched transactions:", transactions);

        // Calculate totals
        const totalBillsAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
        const totalTransactionsAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Log totals
        console.log("Total Bills Amount:", totalBillsAmount);
        console.log("Total Transactions Amount:", totalTransactionsAmount);

        // Set total values to state
        setTotalBills(totalBillsAmount);
        setTotalTransactions(totalTransactionsAmount);

        // Aggregate data by month using Map
        const aggregateByMonth = (data, key) => {
          const map = new Map();
          data.forEach(item => {
            const month = getMonth(item.date);
            if (map.has(month)) {
              map.set(month, map.get(month) + item.amount);
            } else {
              map.set(month, item.amount);
            }
          });
          return map;
        };

        const billMap = aggregateByMonth(bills, 'bills');
        const transactionMap = aggregateByMonth(transactions, 'transaction');

        // Merge the data from both maps
        const allMonths = new Set([...billMap.keys(), ...transactionMap.keys()]);
        const mergedData = Array.from(allMonths).map(month => ({
          month,
          bills: billMap.get(month) || 0,
          transaction: transactionMap.get(month) || 0,
        }));

        // Log merged data
        console.log("Merged Data:", mergedData);
        setData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatTooltipValue = (value) => `${formatNumber(value)} `;
  const formatYAxisLabel = (value) => `${formatNumber(value)} `;
  const formatLegendValue = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Bills and Transactions</h5>
        <div className="chart-info-data">
          <div className="info-data-value">$ {formatNumber(totalBills + totalTransactions)}K</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% more than last month.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <XAxis
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip formatter={formatTooltipValue} cursor={{ fill: "transparent" }} />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="transaction"
              fill="#475be8"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="bills"
              fill="#e3e7fc"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
