import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/AdminDashboard.css";
import "../main/AdminFieldList.css";

const PAGE_SIZE = 15;

const UserManager = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Lỗi tải người dùng:", err);
      }
    };

    fetchUsers();
  }, [user]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="admin-container">
      <h1 className="admin-title">Sân Siêu Tốc - Quản lý Người Dùng</h1>

      <div className="admin-header">
        <div className="admin-tabs">
          <button className="tab" onClick={() => navigate("/admin")}>Tổng quan</button>
          <button className="tab" onClick={() => navigate("/admin/fields")}>Quản lý Sân</button>
          <button className="tab" onClick={() => navigate("/admin/owners")}>Chủ Sân</button>
          <button className="tab active">Người Dùng</button>
          <button className="tab" onClick={() => navigate("/admin/bookings")}>Lịch Đặt</button>
        </div>

        <button
          className="auth-button logout-button"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div className="field-list-toolbar">
        <h2>Danh sách người dùng</h2>
      </div>

      <div className="field-search">
        <input
          type="text"
          className="search-input-giant"
          placeholder="🔍 Tìm kiếm tên hoặc email..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="field-table">
        <div className="field-table-header">
          <span>Tên</span>
          <span>Email</span>
          <span>Vai trò</span>
          <span>Điện thoại</span>
          <span>Địa chỉ</span>
        </div>

        {paginatedUsers.map((user) => (
          <div className="field-table-row" key={user._id}>
            <span>{user.name}</span>
            <span>{user.email}</span>
            <span>{user.role}</span>
            <span>{user.phone || "-"}</span>
            <span>{user.address || "-"}</span>
          </div>
        ))}
      </div>

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

export default UserManager;
