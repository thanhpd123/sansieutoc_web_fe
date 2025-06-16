import React, { useEffect, useState } from "react";
import axios from "axios";

const RevenueBySlot = ({ token, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchRevenue = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get("http://localhost:3001/report/slot", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...(startDate && { from: startDate }),
            ...(endDate && { to: endDate }),
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu theo khung giờ:", err);
        setError("Không thể tải dữ liệu khung giờ.");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [token, startDate, endDate]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="revenue-table-container">
      {error ? (
        <p className="error-text">{error}</p>
      ) : loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="revenue-table">
          <thead>
            <tr>
              <th>Khung giờ</th>
              <th>Tổng doanh thu</th>
              <th>Số lượt đặt</th>
            </tr>
          </thead>
          <tbody>
            {data.map((slot, index) => (
              <tr key={index}>
                <td>{slot.slot}</td>
                <td>{formatCurrency(slot.totalRevenue)}</td>
                <td>{slot.totalBookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevenueBySlot;
