import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../main/RevenueReport.css";

const CompareRevenue = () => {
  const [type, setType] = useState("month"); // "month" or "year"
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          type === "month"
            ? `/report/compare/month?year=${year}`
            : `/report/compare/year`
        );

        const formatted = res.data.map((item) => ({
          label: type === "month" ? `Tháng ${item._id}` : `Năm ${item._id}`,
          revenue: item.totalRevenue,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, [type, year]);

  return (
    <div className="compare-container">
      <h2 style={{ marginBottom: 10 }}>So sánh doanh thu</h2>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setType("month")} className={type === "month" ? "active" : ""}>
          Theo tháng
        </button>
        <button onClick={() => setType("year")} className={type === "year" ? "active" : ""}>
          Theo năm
        </button>

        {type === "month" && (
          <input
            type="number"
            min="2000"
            max={new Date().getFullYear()}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ marginLeft: 10 }}
          />
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip formatter={(value) => new Intl.NumberFormat("vi-VN").format(value) + " VND"} />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" name="Doanh thu" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompareRevenue;
