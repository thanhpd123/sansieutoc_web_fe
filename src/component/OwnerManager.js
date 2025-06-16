import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/AdminDashboard.css";
import "../main/AdminFieldList.css"; // dùng lại CSS cho bảng

const OwnerManager = ({ user }) => {
  const [owners, setOwners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOwners, setFilteredOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/auth/users?role=manager", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setOwners(res.data);
        setFilteredOwners(res.data);
      })
      .catch((err) => console.error("Lỗi tải chủ sân:", err));
  }, [user.token]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = owners.filter(
      (o) =>
        o.name?.toLowerCase().includes(keyword) ||
        o.email?.toLowerCase().includes(keyword)
    );
    setFilteredOwners(filtered);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Sân Siêu Tốc - Quản lý Chủ Sân</h1>

      {/* Header */}
      <div className="admin-header">
        <div className="admin-tabs">
          <button className="tab" onClick={() => navigate("/admin")}>Tổng quan</button>
          <button className="tab" onClick={() => navigate("/admin/fields")}>Quản lý Sân</button>
          <button className="tab active">Chủ Sân</button>
          <button className="tab" onClick={() => navigate("/admin/users")}>Người Dùng</button>
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

      {/* Toolbar */}
      <div className="field-list-toolbar">
        <h2>Danh sách chủ sân</h2>
      </div>

      {/* Search */}
      <div className="field-search">
        <input
          type="text"
          className="search-input-giant"
          placeholder="🔍 Tìm kiếm tên hoặc email..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="field-table">
        <div className="field-table-header">
          <span>Tên</span>
          <span>Email</span>
          <span>SĐT</span>
          <span>Địa chỉ</span>
        </div>

        {filteredOwners.map((owner) => (
          <div className="field-table-row" key={owner._id}>
            <span>{owner.name || "Chưa có tên"}</span>
            <span>{owner.email}</span>
            <span>{owner.phone || "N/A"}</span>
            <span>{owner.address || "N/A"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerManager;
