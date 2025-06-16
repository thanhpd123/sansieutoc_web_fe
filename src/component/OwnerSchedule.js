import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../main/OwnerSchedule.css";
import "../Home.css"; // Đảm bảo dùng chung style với OwnerFields

const OwnerSchedule = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("today");
  const [selectedDate] = useState("");
  const [selectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://sansieutoc-web-be.onrender.com/booking/owner", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(res.data);
        setFilteredBookings(res.data); // mặc định ban đầu
      } catch (err) {
        console.error("Lỗi khi tải lịch:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Lọc dữ liệu theo filterType
  useEffect(() => {
    if (!bookings) return;

    const todayStr = new Date().toISOString().split("T")[0];

    let filtered = [];

    switch (filterType) {
      case "today":
        filtered = bookings.filter((b) => b.date === todayStr);
        break;
      case "date":
        filtered = bookings.filter((b) => b.date === selectedDate);
        break;
      case "month":
        filtered = bookings.filter((b) =>
          b.date?.startsWith(selectedMonth)
        );
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered);
  }, [filterType, selectedDate, selectedMonth, bookings]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="font-sans">
      {/* Header giống OwnerFields */}
      <header className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/manager/fields")}
        >
          <img
            src="/images/logo_sansieutoc.png"
            alt="Sân Siêu Tốc Logo"
            className="footer-logo"
            style={{ height: 50, width: "auto", objectFit: "contain", maxWidth: 160 }}
          />
        </div>
        <nav className="menu">
          <Link to="/manager/fields">Danh Sách Cơ Bản</Link>
          <Link to="/manager/bookings">Quản Lý Lịch Đặt</Link>
          <Link to="/manager/revenue">Báo Cáo Doanh Thu</Link>
          <Link to="#">Đặt Sân</Link>
          <Link to="#">Hướng Dẫn</Link>
        </nav>
        <div className="auth-search">
          <button onClick={handleLogout} className="auth-button logout-button">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Banner + filter + tab layout */}
      <div
        style={{
          width: "100%",
          position: "relative",
          background: "#e5e5e5",
          borderRadius: "0 0 2rem 2rem",
          overflow: "hidden",
          minHeight: 260,
          marginBottom: 0,
        }}
      >
        <img
          src="/images/a.png"
          alt="Sân thể thao"
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            zIndex: 2,
            padding: "0 16px",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "2.2rem",
              margin: 0,
              textShadow: "0 2px 8px #2228",
              color: "#fff",
            }}
          >
            Lịch đặt sân
          </h1>
          {/* Filter input + tab */}
          <div style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 500,
            gap: 16,
          }}>
            <input
              type="text"
              value="Sân bóng KTX Đại học FPT"
              readOnly
              style={{
                width: "100%",
                border: "1px solid #ffe082",
                borderRadius: 6,
                padding: "10px 12px",
                background: "#fffde7",
                marginBottom: 8,
              }}
            />
            <input
              type="text"
              value="Tất cả sân"
              readOnly
              style={{
                width: "100%",
                border: "1px solid #ffe082",
                borderRadius: 6,
                padding: "10px 12px",
                background: "#fffde7",
                marginBottom: 8,
              }}
            />
            <div style={{
              display: "flex",
              gap: 0,
              background: "rgba(255,255,255,0.7)",
              borderRadius: 32,
              overflow: "hidden",
              width: 320,
              maxWidth: "90vw",
              justifyContent: "center",
              boxShadow: "0 2px 12px #0002"
            }}>
              <button
                className={filterType === "today" ? "tab-active" : "tab-inactive"}
                style={{
                  flex: 1,
                  padding: "16px 0",
                  background: filterType === "today" ? "#fff" : "transparent",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: filterType === "today" ? "#222" : "#555",
                  cursor: "pointer",
                  borderRadius: "32px 0 0 32px",
                  transition: "background 0.2s"
                }}
                onClick={() => setFilterType("today")}
              >
                Theo ngày
              </button>
              <button
                className={filterType === "month" ? "tab-active" : "tab-inactive"}
                style={{
                  flex: 1,
                  padding: "16px 0",
                  background: filterType === "month" ? "#fff" : "transparent",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: filterType === "month" ? "#222" : "#555",
                  cursor: "pointer",
                  borderRadius: "0 32px 32px 0",
                  transition: "background 0.2s"
                }}
                onClick={() => setFilterType("month")}
              >
                Theo tháng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="content-wrapper" style={{ background: "#fff", borderRadius: "0 0 2rem 2rem", margin: "0 0 32px 0", padding: "32px 0 0 0" }}>
        <section className="fields-list-container" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {/* Tab switcher for table view */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button
              className={filterType === "today" ? "tab-active" : "tab-inactive"}
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "1px solid #bdbdbd",
                background: filterType === "today" ? "#e0ffe0" : "#fff",
                color: filterType === "today" ? "#00c853" : "#222",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => setFilterType("today")}
            >
              Tháng ngày
            </button>
            <button
              className={filterType === "month" ? "tab-active" : "tab-inactive"}
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "1px solid #bdbdbd",
                background: filterType === "month" ? "#e0ffe0" : "#fff",
                color: filterType === "month" ? "#00c853" : "#222",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => setFilterType("month")}
            >
              Theo tháng
            </button>
            <button
              style={{
                marginLeft: "auto",
                background: "#ff6f6f",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Đóng sân
            </button>
          </div>

          {/* Danh sách lịch */}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : filteredBookings.length === 0 ? (
            <p>Không có lịch đặt sân phù hợp.</p>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Sân</th>
                  <th>Sân con</th>
                  <th>Giờ</th>
                  <th>Người đặt</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.date}</td>
                    <td>{b.fieldId?.name}</td>
                    <td>{b.fieldUnitId?.unitNumber || "-"}</td>
                    <td>{b.startTime} - {b.endTime}</td>
                    <td>{b.userId?.name || "Ẩn"}</td>
                    <td className={`status-${b.status}`}>{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      {/* Footer giống OwnerFields */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Giới thiệu</h3>
            <ul>
              <li>
                <Link to="/about-us">SANSIEUTOC là gì?</Link>
              </li>
              <li>
                <Link to="/company-profile">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/faq">Câu hỏi thường gặp</Link>
              </li>
              <li>
                <Link to="/privacy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="/terms">Điều khoản sử dụng</Link>
              </li>
              <li>
                <Link to="/guides">Hướng dẫn sử dụng</Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Dịch vụ sản phẩm</h3>
            <ul>
              <li>
                <Link to="/services/coaching">Huấn luyện viên thể thao</Link>
              </li>
              <li>
                <Link to="/services/rentals">Cho thuê sân thể thao</Link>
              </li>
              <li>
                <Link to="/services/events">Tổ chức sự kiện thể thao</Link>
              </li>
              <li>
                <Link to="/services/talent">Quản lý tài năng thể thao</Link>
              </li>
              <li>
                <Link to="/services/store">Bán thiết bị thể thao</Link>
              </li>
              <li>
                <Link to="/services/centers">
                  Trung tâm thể thao tích hợp
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Thông tin</h3>
            <p>Công ty Cổ phần SANSIEUTOC</p>
            <p>MST: 6666668888</p>
            <p>Địa chỉ: Đại học FPT Hà Nội</p>
            <p>Email: contact@sansieutoc.com</p>
            <p>Điện thoại: 0987654321</p>
            <div className="social-icons">
              <a
                href="https://facebook.com/sansieutoc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png"
                  alt="Facebook"
                />
              </a>
              <a
                href="https://youtube.com/sansieutoc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/youtube--v1.png"
                  alt="Youtube"
                />
              </a>
              <a
                href="https://instagram.com/sansieutoc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png"
                  alt="Instagram"
                />
              </a>
              <a
                href="https://tiktok.com/@sansieutoc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ffffff/tiktok--v1.png"
                  alt="TikTok"
                />
              </a>
            </div>
          </div>
          <div className="footer-column last-column">
            <h3>Liên hệ ngay</h3>
            <p className="contact-text">
              GIẢI PHÁP CÔNG NGHỆ GIÚP NGƯỜI DÙNG DỄ DÀNG ĐẶT SÂN THỂ THAO MỌI
              LÚC MỌI NƠI
            </p>
            <img
              src="/images/logo_sansieutoc.png"
              alt="Sân Siêu Tốc Logo"
              className="footer-logo"
            />
          </div>
        </div>
      </footer>
      {/* Style cho tab bo tròn và filter input vàng */}
      <style>{`
        .tab-active {
          background: #fff !important;
          color: #222 !important;
          font-weight: 700;
          box-shadow: 0 2px 8px #ffd60033;
        }
        .tab-inactive {
          background: transparent !important;
          color: #555 !important;
        }
      `}</style>
    </div>
  );
};

export default OwnerSchedule;
