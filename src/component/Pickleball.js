import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../main/Bongda.css";

// ==========================
// Component hiển thị từng thẻ sân
// ==========================
const FieldCard = ({ field, user }) => {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getTypeDisplayName = (type) => (type?.name ? type.name : "N/A");

  const handleBookingClick = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt sân.");
      return;
    }
    navigate(`/booking/${field._id}`);
  };

  const handleImageClick = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để xem chi tiết sân.");
      return;
    }
    navigate(`/booking/${field._id}`);
  };

  return (
    <div className="field-card">
      <div className="field-image-container" onClick={handleImageClick} style={{ cursor: "pointer" }}>
        {field.images?.length > 0 ? (
          <img src={field.images[0]} alt={field.name} className="field-image" />
        ) : (
          <div className="no-image">Không có ảnh</div>
        )}
        <span className="field-type-tag">{getTypeDisplayName(field.type)}</span>
      </div>
      <div className="field-info">
        <p className="field-price">{formatPrice(field.pricePerHour)}</p>
        <h3 className="field-name">{field.name}</h3>
        <div className="field-location">
          <img
            src="https://img.icons8.com/ios-filled/24/000000/marker.png"
            alt="location icon"
            className="location-icon"
          />
          <span>{field.address}</span>
        </div>
        <button className="btn-dat-san" onClick={handleBookingClick}>
          Đặt sân
        </button>
      </div>
    </div>
  );
};

// ==========================
// Component chính
// ==========================
const Pickleball = () => {
  const [user, setUser] = useState(null);
  const [loaiSans, setLoaiSans] = useState([]);
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);

  const [loadingLoaiSans, setLoadingLoaiSans] = useState(true);
  const [loadingFields, setLoadingFields] = useState(true);
  const [errorLoaiSans, setErrorLoaiSans] = useState(null);
  const [errorFields, setErrorFields] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem("userData");
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  useEffect(() => {
    axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/type")
      .then(res => setLoaiSans(res.data))
      .catch(() => setErrorLoaiSans("Không thể tải loại sân."))
      .finally(() => setLoadingLoaiSans(false));
  }, []);

  useEffect(() => {
    axios.get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/field")
      .then(res => setFields(res.data))
      .catch(() => setErrorFields("Không thể tải danh sách sân."))
      .finally(() => setLoadingFields(false));
  }, []);

  // Lọc sân pickleball theo từ khóa truyền từ Home (nếu có)
  useEffect(() => {
    let result = fields.filter(
      (field) => field.type?.name?.toLowerCase() === "pickleball"
    );
    const params = new URLSearchParams(location.search);
    const searchName = params.get("name")?.toLowerCase() || "";
    const searchPrice = params.get("area") || ""; // area là giá sân truyền từ Home

    if (searchName) {
      result = result.filter(
        (field) =>
          field.name?.toLowerCase().includes(searchName) ||
          field.address?.toLowerCase().includes(searchName)
      );
    }
    if (searchPrice) {
      result = result.filter(field =>
        String(field.pricePerHour).includes(searchPrice)
      );
    }
    setFilteredFields(result);
  }, [fields, location.search]);

  return (
    <div className="font-sans">
      {/* Navbar */}
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
          <Link to="/">Trang chủ</Link>
          <Link to="/coach">Huấn luyện viên cá nhân</Link>
          <Link to="#">Dụng cụ thể thao</Link>
          <Link to="#">Bài tập luyện</Link>
          <Link to="/lichsu-datsan">Lịch Sử</Link>
        </nav>

        <div className="auth-search">
          {user ? (
            <>
              <span className="user-name">Xin chào, {user.name}!</span>
              <button onClick={handleLogout} className="auth-button logout-button">
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="auth-button">Đăng ký</Link>
              <Link to="/login" className="auth-button">Đăng nhập</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="content-wrapper">
        <div className="yellow-strip">
          <nav className="loaisan-nav">
            {loadingLoaiSans ? (
              <p>Đang tải...</p>
            ) : errorLoaiSans ? (
              <p>{errorLoaiSans}</p>
            ) : (
              loaiSans.map((loai) => (
                <a key={loai._id} href={`/loaisan/${loai._id}`}>
                  {loai.name}
                </a>
              ))
            )}
          </nav>
        </div>

        <section className="fields-list-container">
          <h1 className="t1">Sân Pickleball</h1>
          {loadingFields ? (
            <div className="loading">Đang tải dữ liệu sân...</div>
          ) : errorFields ? (
            <div className="error">{errorFields}</div>
          ) : (
            <div className="fields-grid">
              {filteredFields.length === 0 ? (
                <p>Không tìm thấy sân phù hợp.</p>
              ) : (
                filteredFields.map((field) => (
                  <FieldCard key={field._id} field={field} user={user} />
                ))
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Giới thiệu</h3>
            <ul>
              <li><a href="#">SANSIEUTOC là gì?</a></li>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Hướng dẫn sử dụng</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Dịch vụ sản phẩm</h3>
            <ul>
              <li><a href="#">Huấn luyện viên thể thao</a></li>
              <li><a href="#">Cho thuê sân thể thao</a></li>
              <li><a href="#">Tổ chức sự kiện thể thao</a></li>
              <li><a href="#">Quản lý tài năng thể thao</a></li>
              <li><a href="#">Bán thiết bị thể thao</a></li>
              <li><a href="#">Trung tâm thể thao tích hợp</a></li>
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
              <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/facebook-new.png" alt="Facebook" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/youtube--v1.png" alt="Youtube" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png" alt="Instagram" /></a>
              <a href="#"><img src="https://img.icons8.com/ios-filled/24/ffffff/tiktok--v1.png" alt="TikTok" /></a>
            </div>
          </div>

          <div className="footer-column last-column">
            <h3>Liên hệ ngay</h3>
            <p className="contact-text">
              GIẢI PHÁP CÔNG NGHỆ GIÚP NGƯỜI DÙNG DỄ DÀNG ĐẶT SÂN THỂ THAO MỌI LÚC MỌI NƠI
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

export default Pickleball;