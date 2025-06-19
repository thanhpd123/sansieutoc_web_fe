import { useEffect, useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import '../main/AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [totalFields, setTotalFields] = useState(0);
  const [activeOwners, setActiveOwners] = useState(0);
  const [todayBookingCount, setTodayBookingCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [fieldsRes, bookingsRes, managersRes] = await Promise.all([
          axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/field", { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/booking/today-count", { headers: { Authorization: `Bearer ${user.token}` } }),
          axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/auth/count/manager", { headers: { Authorization: `Bearer ${user.token}` } }),
        ]);

        setTotalFields(fieldsRes.data.length);
        setTodayBookingCount(bookingsRes.data.count);
        setActiveOwners(managersRes.data.count);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tổng quan:", err);
      }
    };


    if (user) fetchDashboardData();
  }, [user]);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Sân Siêu Tốc - Admin Dashboard</h1>

      <div className="admin-header">
        <div className="admin-tabs">
          <button className="tab active">Tổng quan</button>
          <button className="tab" onClick={() => navigate("/admin/fields")}>Quản lý Sân</button>
          <button className="tab" onClick={() => navigate("/admin/owners")}>Chủ Sân</button>
          <button className="tab" onClick={() => navigate("/admin/users")}>Người Dùng</button>
          <button className="tab" onClick={() => navigate("/admin/bookings")}>Lịch Đặt</button>
        </div>

        <div className="auth-section">
          {user ? (
            <button onClick={handleLogout} className="auth-button logout-button">Đăng xuất</button>
          ) : (
            <>
              <Link to="/register" className="auth-button">Đăng ký</Link>
              <Link to="/login" className="auth-button">Đăng nhập</Link>
            </>
          )}
        </div>
      </div>

      <div className="admin-summary">
        <div className="summary-card" onClick={() => navigate("/admin/fields")}>
          <p className="summary-title">Tổng số sân</p>
          <h2>{totalFields}</h2>
        </div>

        <div className="summary-card" onClick={() => navigate("/admin/owners")}>
          <p className="summary-title">Chủ sân đang hoạt động</p>
          <h2>{activeOwners}</h2>
        </div>

        <div className="summary-card" onClick={() => navigate("/admin/bookings")}>
          <p className="summary-title">Lượt đặt hôm nay</p>
          <h2>{todayBookingCount}</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
