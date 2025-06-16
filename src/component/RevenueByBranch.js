import React, { useEffect, useState } from "react";
import axios from "axios";

const RevenueByBranch = ({ token, userId, startDate, endDate }) => {
  console.log("RevenueByBranch render");
  const [data, setData] = useState({ totalRevenue: 0, bookingCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/report/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ownerId: userId,
            ...(startDate && { from: startDate }),
            ...(endDate && { to: endDate }),
          },
        });

        setData(response.data || { totalRevenue: 0, bookingCount: 0 });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu doanh thu theo cơ sở:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, startDate, endDate]);

  console.log("data:", data, "loading:", loading);
  return (
    <div className="revenue-table-container">
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="revenue-table">
          <thead>
            <tr>
              <th>Tổng doanh thu</th>
              <th>Số lượt đặt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.totalRevenue.toLocaleString()} đ</td>
              <td>{data.bookingCount}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevenueByBranch;
