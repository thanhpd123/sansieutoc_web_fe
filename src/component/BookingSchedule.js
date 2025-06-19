import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/AdminDashboard.css";
import "../main/AdminFieldList.css";

const PAGE_SIZE = 15;

const BookingSchedule = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn//booking/admin", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = res.data.bookings || res.data;
        setBookings(data);
        setFilteredBookings(data);
      } catch (err) {
        console.error("Lỗi khi tải lịch đặt:", err);
      }
    };

    fetchBookings();
  }, [user]);

  const applyFilter = useCallback((type) => {
    setFilterType(type);
    const today = new Date();
    const newFiltered = bookings.filter((b) => {
      const bookingDate = new Date(b.date);
      if (type === "today") {
        return bookingDate.toDateString() === today.toDateString();
      } else if (type === "month") {
        return (
          bookingDate.getMonth() === today.getMonth() &&
          bookingDate.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });

    const keyword = searchTerm.toLowerCase();
    const finalFiltered = newFiltered.filter(
      (b) =>
        b.fieldId?.name?.toLowerCase().includes(keyword) ||
        b.userId?.name?.toLowerCase().includes(keyword)
    );

    setFilteredBookings(finalFiltered);
    setCurrentPage(1);
  }, [bookings, searchTerm]);

  useEffect(() => {
    applyFilter(filterType);
  }, [searchTerm, bookings, applyFilter, filterType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const totalPages = Math.ceil(filteredBookings?.length / PAGE_SIZE);
  const paginated = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Sân Siêu Tốc - Lịch Đặt Sân</h1>

      {/* Header và tab điều hướng */}
      <div className="admin-header">
        <div className="admin-tabs">
          <button className="tab" onClick={() => navigate("/admin")}>Tổng quan</button>
          <button className="tab" onClick={() => navigate("/admin/fields")}>Quản lý Sân</button>
          <button className="tab" onClick={() => navigate("/admin/owners")}>Chủ Sân</button>
          <button className="tab" onClick={() => navigate("/admin/users")}>Người Dùng</button>
          <button className="tab active">Lịch Đặt</button>
        </div>
        <button className="auth-button logout-button" onClick={handleLogout}>Đăng xuất</button>
      </div>

      {/* Thanh công cụ */}
      <div className="field-list-toolbar">
        <h2>Danh sách lịch đặt</h2>
      </div>

      {/* Bộ lọc */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <button
          className={`filter-button ${filterType === "all" ? "active" : ""}`}
          onClick={() => applyFilter("all")}
        >
          Tất cả
        </button>
        <button
          className={`filter-button ${filterType === "today" ? "active" : ""}`}
          onClick={() => applyFilter("today")}
        >
          Hôm nay
        </button>
        <button
          className={`filter-button ${filterType === "month" ? "active" : ""}`}
          onClick={() => applyFilter("month")}
        >
          Tháng này
        </button>
      </div>

      {/* Tìm kiếm */}
      <div className="field-search">
        <input
          type="text"
          className="search-input-giant"
          placeholder="🔍 Tìm theo tên sân hoặc người đặt..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Bảng lịch đặt */}
      <div className="field-table">
        <div className="field-table-header">
          <span>Ngày</span>
          <span>Thời gian</span>
          <span>Sân</span>
          <span>Người đặt</span>
          <span>Trạng thái</span>
        </div>

        {paginated.map((booking) => (
          <div className="field-table-row" key={booking._id}>
            <span>{booking.date}</span>
            <span>{booking.startTime} - {booking.endTime}</span>
            <span>{booking.fieldId?.name || "Không rõ"}</span>
            <span>{booking.userId?.name || "Không rõ"}</span>
            <span
              className={`status-label ${booking.status === "confirmed"
                ? "booked"
                : booking.status === "cancelled"
                  ? "cancelled"
                  : "available"
                }`}
            >
              {booking.status === "confirmed"
                ? "Đã xác nhận"
                : booking.status === "cancelled"
                  ? "Đã hủy"
                  : "Chờ xử lý"}
            </span>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            className={`page-button ${currentPage === idx + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingSchedule;
