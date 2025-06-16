import React, { useEffect, useState } from "react";
import axios from "axios";

const RevenueByField = ({ token, userId, startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("RevenueByField userId:", userId);


  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/report/field`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ownerId: userId,
            ...(startDate && { from: startDate }),
            ...(endDate && { to: endDate }),
          },
        });
         console.log("API response:", res.data);  
        setData(res.data || []);
      } catch (err) {
        console.error("Lỗi khi gọi API doanh thu theo sân:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, startDate, endDate]);

  return (
    <div className="revenue-table-container">
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="revenue-table">
          <thead>
            <tr>
              <th>Tên sân</th>
              <th>Tổng doanh thu</th>
              <th>Số lượt đặt</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{row.fieldName || "Không rõ"}</td>
                  <td>{(row.totalRevenue || 0).toLocaleString("vi-VN")} đ</td>
                  <td>{row.bookingCount || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevenueByField;
