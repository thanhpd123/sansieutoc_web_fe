import React, { useState, useMemo } from "react";
import RevenueByBranch from "./RevenueByBranch";
import RevenueByField from "./RevenueByField";
import RevenueBySlot from "./RevenueBySlot";
import { Link, useNavigate } from "react-router-dom";
import "../Home.css";

const RevenueReport = ({ user }) => {
  const [tab, setTab] = useState("branch");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const userData = useMemo(() => {
    const raw = localStorage.getItem("userData");
    return raw ? JSON.parse(raw) : null;
  }, []);
  const userId = userData?._id || userData?.id;
  const token = userData?.token;

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Demo filter state (bạn thay bằng filter thực tế nếu muốn)
  const [branch] = useState("Sân bóng KTX Đại học FPT");
  const [slot] = useState("Slot 6h00 - 8h00");
  const [field] = useState("Tất cả sân");

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
            style={{
              height: 50,
              width: "auto",
              objectFit: "contain",
              maxWidth: 160,
            }}
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
          <button
            onClick={handleLogout}
            className="auth-button logout-button"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Banner + Tabs */}
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
            Báo cáo doanh thu
          </h1>
          {/* Tabs */}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 0,
              background: "rgba(255,255,255,0.7)",
              borderRadius: 32,
              overflow: "hidden",
              width: 420,
              maxWidth: "90vw",
              justifyContent: "center",
              boxShadow: "0 2px 12px #0002",
            }}
          >
            <button
              className={tab === "branch" ? "tab-active" : "tab-inactive"}
              style={{
                flex: 1,
                padding: "16px 0",
                background: tab === "branch" ? "#fff" : "transparent",
                border: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: tab === "branch" ? "#222" : "#555",
                cursor: "pointer",
                borderRadius: "32px 0 0 32px",
                transition: "background 0.2s",
              }}
              onClick={() => setTab("branch")}
            >
              Theo cơ sở
            </button>
            <button
              className={tab === "field" ? "tab-active" : "tab-inactive"}
              style={{
                flex: 1,
                padding: "16px 0",
                background: tab === "field" ? "#fff" : "transparent",
                border: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: tab === "field" ? "#222" : "#555",
                cursor: "pointer",
                borderRadius: 0,
                transition: "background 0.2s",
              }}
              onClick={() => setTab("field")}
            >
              Theo sân
            </button>
            <button
              className={tab === "slot" ? "tab-active" : "tab-inactive"}
              style={{
                flex: 1,
                padding: "16px 0",
                background: tab === "slot" ? "#fff" : "transparent",
                border: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: tab === "slot" ? "#222" : "#555",
                cursor: "pointer",
                borderRadius: "0 32px 32px 0",
                transition: "background 0.2s",
              }}
              onClick={() => setTab("slot")}
            >
              Theo slot
            </button>
          </div>
        </div>
      </div>

      {/* Filter + Table/Tổng kết */}
      <div
        style={{
          background: "#fff",
          padding: "32px 0 0 0",
          borderRadius: "0 0 2rem 2rem",
          margin: "0 0 32px 0",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Filter */}
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Theo tab hiển thị filter phù hợp */}
            {tab === "branch" && (
              <>
                <input
                  type="text"
                  value={`Cơ sở: ${branch}`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  value={`${startDate && endDate
                    ? `${startDate.split("-").reverse().join("/")} - ${endDate
                      .split("-")
                      .reverse()
                      .join("/")}`
                    : "1/1/2025 - 28/2/2025"
                    }`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
              </>
            )}
            {tab === "slot" && (
              <>
                <input
                  type="text"
                  value={`Cơ sở: ${branch}`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  value={slot}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  value={`${startDate && endDate
                    ? `${startDate.split("-").reverse().join("/")} - ${endDate
                      .split("-")
                      .reverse()
                      .join("/")}`
                    : "1/1/2025 - 28/2/2025"
                    }`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
              </>
            )}
            {tab === "field" && (
              <>
                <input
                  type="text"
                  value={`Cơ sở: ${branch}`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  value={field}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
                <input
                  type="text"
                  value={`${startDate && endDate
                    ? `${startDate.split("-").reverse().join("/")} - ${endDate
                      .split("-")
                      .reverse()
                      .join("/")}`
                    : "1/1/2025 - 28/2/2025"
                    }`}
                  readOnly
                  style={{
                    flex: 1,
                    border: "1px solid #ffe082",
                    borderRadius: 6,
                    padding: "10px 12px",
                    background: "#fffde7",
                    marginBottom: 8,
                  }}
                />
              </>
            )}
          </div>
          {/* Bộ lọc ngày thực tế */}
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <label>
              Từ:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  marginLeft: 8,
                  border: "1px solid #ffe082",
                  borderRadius: 6,
                  padding: "6px 10px",
                  background: "#fffde7",
                }}
              />
            </label>
            <label>
              Đến:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  marginLeft: 8,
                  border: "1px solid #ffe082",
                  borderRadius: 6,
                  padding: "6px 10px",
                  background: "#fffde7",
                }}
              />
            </label>
          </div>
          {/* Bảng/tổng kết */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              border: "1px solid #e0e0e0",
              minHeight: 220,
              padding: 0,
              marginBottom: 32,
              overflow: "hidden",
            }}
          >
            {/* Hiển thị bảng/tổng kết theo tab */}
            {tab === "branch" && userId && (
              <RevenueByBranch
                token={token}
                userId={userId}
                startDate={startDate}
                endDate={endDate}
              />
            )}
            {tab === "field" && userId && (
              <RevenueByField
                token={token}
                userId={userId}
                startDate={startDate}
                endDate={endDate}
              />
            )}
            {tab === "slot" && userId && (
              <RevenueBySlot
                token={token}
                userId={userId}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        </div>
      </div>

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
                <Link to="/services/centers">Trung tâm thể thao tích hợp</Link>
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

export default RevenueReport;
