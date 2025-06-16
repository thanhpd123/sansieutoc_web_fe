import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Home.css"; // Assuming you have a CSS file for styles

const OwnerFields = ({ user }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchFields = async () => {
      try {
        const res = await axios.get("/field/owner", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFields(res.data);
      } catch (err) {
        console.error("Lỗi API:", err.response?.data || err.message);
        setError("Không thể tải danh sách sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCreateClick = () => navigate("/manager/fields/create");
  const handleEditClick = (id) => navigate(`/manager/fields/${id}/edit`);
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá sân này?")) return;
    try {
      await axios.delete(`/field/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFields(fields.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Xoá sân lỗi:", err);
      alert("Không thể xoá sân.");
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getTypeName = (type) => type?.name || "Không rõ";

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
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

      {/* Nội dung chính */}
      <main className="content-wrapper">
        <section>
          {/* Banner section giống ảnh đính kèm */}
          <div
            style={{
              width: "100%",
              position: "relative",
              marginBottom: "24px",
              background: "#e5e5e5",
              borderRadius: "0 0 2rem 2rem",
              overflow: "hidden",
            }}
          >
            <img
              src="/images/a.png"
              alt="Sân thể thao"
              style={{
                width: "100%",
                height: "320px",
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
              <h2 style={{
                fontWeight: 700,
                fontSize: "2rem",
                margin: 0,
                textShadow: "0 2px 8px #2228",
                color: "#fff" // Đảm bảo màu trắng cho dòng chữ
              }}>
                GIẢI PHÁP CÔNG NGHỆ<br />
                GIÚP CHỦ SÂN THỂ THAO TỐI ƯU QUẢN LÝ & VẬN HÀNH
              </h2>
              <p style={{
                marginTop: 16,
                fontSize: "1.1rem",
                textShadow: "0 1px 6px #2226"
              }}>
                Dữ liệu được SANSIEUTOC cập nhật thường xuyên giúp cho người dùng tìm được sân một cách nhanh nhất
              </p>
            </div>
          </div>
        </section>
        <section className="fields-list-container">
          <h1 className="t1">Danh Sách Cơ Sở</h1>

          {/* Nút Thêm sân */}
          <div className="text-center mt-3 mb-3">
            <button className="btn-dat-san" onClick={handleCreateClick}>
              Thêm sân
            </button>
          </div>

          {/* Danh sách sân */}
          {loading ? (
            <div className="loading">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : fields.length === 0 ? (
            <p>Chưa có sân nào được đăng.</p>
          ) : (
            <div className="fields-grid">
              {fields.map((field) => (
                <div key={field._id} className="field-card">
                  <div className="field-image-container" onClick={() => handleEditClick(field._id)}>
                    {field.images?.[0] ? (
                      <img src={field.images[0]} alt={field.name} className="field-image" />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                    <span className="field-type-tag">{getTypeName(field.type)}</span>
                  </div>

                  <div className="field-info">
                    <p className="field-price">{formatPrice(field.pricePerHour)}</p>
                    <h3 className="field-name">{field.name}</h3>
                    <div className="field-location">
                      <img
                        src="https://img.icons8.com/ios-filled/24/000000/marker.png"
                        alt="location"
                        className="location-icon"
                      />
                      <span>{field.address}</span>
                    </div>

                    <div className="field-actions">
                      <button className="btn-dat-san" onClick={() => handleEditClick(field._id)}>
                        Chỉnh sửa
                      </button>
                      <button
                        className="auth-button logout-button"
                        onClick={() => handleDeleteClick(field._id)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
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
    </div>
  );
};

export default OwnerFields;
