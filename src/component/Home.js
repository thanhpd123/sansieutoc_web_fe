import React, { useState, useEffect } from "react";
import axios from "axios";
import "../main/Home.css";
import { Link, useNavigate } from "react-router-dom";

// Component hiển thị thẻ sân
const FieldCard = ({ field, user }) => {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const getTypeDisplayName = (type) => type?.name || "N/A";

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
      <div
        className="field-image-container"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
      >
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
            onClick={handleBookingClick}
            style={{ cursor: "pointer" }}
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

export default function Home() {
  const [loaiSans, setLoaiSans] = useState([]);
  const [fields, setFields] = useState([]);
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState(""); // Lọc theo loại sân
  const [filterName, setFilterName] = useState(""); // Lọc theo tên sân/địa chỉ/loại sân
  const [filterArea, setFilterArea] = useState(""); // Lọc theo khu vực
  const [filteredFields, setFilteredFields] = useState([]); // Kết quả lọc
  const navigate = useNavigate();

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
    axios
      .get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/type")
      .then((res) => setLoaiSans(res.data))
      .catch(console.error);
    axios
      .get("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/field")
      .then((res) => setFields(res.data))
      .catch(console.error);
  }, []);

  // Lọc fields mỗi khi filter thay đổi hoặc fields thay đổi
  useEffect(() => {
    let result = fields;
    if (filterType) {
      result = result.filter(
        (f) =>
          (typeof f.type === "object" ? f.type?._id : f.type) === filterType
      );
    }
    if (filterName) {
      const keyword = filterName.toLowerCase();
      result = result.filter(
        (f) =>
          f.name?.toLowerCase().includes(keyword) ||
          f.address?.toLowerCase().includes(keyword)
      );
    }
    if (filterArea) {
      const area = filterArea.toLowerCase();
      result = result.filter((f) => f.address?.toLowerCase().includes(area));
    }
    setFilteredFields(result);
  }, [fields, filterType, filterName, filterArea]);

  // Sử dụng filteredFields để lấy các sân phổ biến
  const footballField = (Array.isArray(filteredFields) ? filteredFields : []).find(
    (f) => f.type?.name?.toLowerCase() === "bóng đá"
  );
  const basketballField = (Array.isArray(filteredFields) ? filteredFields : []).find(
    (f) => f.type?.name?.toLowerCase() === "bóng rổ"
  );
  const tennisField = (Array.isArray(filteredFields) ? filteredFields : []).find(
    (f) => f.type?.name?.toLowerCase() === "tennis"
  );

  const displayFields = [footballField, basketballField, tennisField].filter(
    Boolean
  );
  let additionalFieldsCount = 0;
  while (
    displayFields.length < 3 &&
    additionalFieldsCount < filteredFields.length
  ) {
    const fieldToAdd = filteredFields[additionalFieldsCount++];
    if (!displayFields.some((f) => f._id === fieldToAdd._id)) {
      displayFields.push(fieldToAdd);
    }
  }

  return (
    <div className="font-sans">
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
          <Link to="/coachbookinghistory">Lịch Đặt Huấn Luyện Viên</Link>
          <Link to="/lichsu-datsan">Lịch sử</Link>
        </nav>
        <div className="auth-search">
          {user ? (
            <>
              <span className="user-name">Xin chào, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="auth-button logout-button"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="auth-button">
                Đăng ký
              </Link>
              <Link to="/login" className="auth-button">
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="content-wrapper">
        <div className="yellow"></div>
        <section className="hero">
          <h1>
            GIẢI PHÁP CÔNG NGHỆ <br /> GIÚP NGƯỜI DÙNG DỄ DÀNG ĐẶT SÂN THỂ THAO
            MỌI LÚC MỌI NƠI
          </h1>
          <p>
            Dữ liệu được <span className="bold">SANSIEUTOC</span> cập nhật
            thường xuyên giúp người dùng tìm sân một cách nhanh nhất
          </p>
          <div className="search-bar">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Lọc theo loại sân</option>
              {Array.isArray(loaiSans) && loaiSans.map((loai) => (
                <option key={loai._id} value={loai._id}>
                  {loai.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Nhập tên sân, địa chỉ "
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}

            />
            <input
              type="text"
              placeholder="Nhập Giá Sân"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
            />
            <button
              onClick={() => {
                const keyword = filterName.trim().toLowerCase();

                // Nếu chọn đúng loại sân đặc biệt thì chuyển trang tương ứng
                const selectedLoai = loaiSans.find(
                  (loai) => loai._id === filterType
                );
                if (selectedLoai) {
                  const name = selectedLoai.name.toLowerCase();
                  if (name === "bóng đá") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d0?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                  if (name === "bóng rổ") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d1?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                  if (name === "tennis") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d2?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                }

                // Nếu nhập đúng tên sân thì chuyển sang trang loại sân phù hợp
                const foundField = fields.find(
                  (f) => f.name?.toLowerCase() === keyword
                );
                if (foundField) {
                  if (foundField.type?.name?.toLowerCase() === "bóng đá") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d0?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                  if (foundField.type?.name?.toLowerCase() === "bóng rổ") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d1?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                  if (foundField.type?.name?.toLowerCase() === "tennis") {
                    navigate(
                      `/loaisan/6836d3231f7f6d0deb0f98d2?name=${filterName}&area=${filterArea}`
                    );
                    return;
                  }
                }
              }}
            >
              Tìm kiếm
            </button>
          </div>
        </section>

        <section className="loaisan-container">
          <h1 className="ten">Loại sân thể thao</h1>
          <div className="loaisan-grid">
            {(Array.isArray(loaiSans) ? loaiSans : []).map((loai) => (
              <div
                key={loai._id}
                className="loaisan-item"
                onClick={() => {
                  if (!user) {
                    alert("Vui lòng đăng nhập để xem chi tiết loại sân.");
                    return;
                  }
                  navigate(`/loaisan/${loai._id}`);
                }}
                style={{ cursor: "pointer" }}
              >
                <img src={`/images/${loai.images}`} alt={`Sân ${loai.name}`} />
                <h3>{loai.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="fields-popular-container">
          <h1 className="ten">Sân phổ biến</h1>
          <div className="fields-grid">
            {displayFields.length === 0 ? (
              <p>Không có sân để hiển thị.</p>
            ) : (
              displayFields.map((field) => (
                <FieldCard key={field._id} field={field} user={user} />
              ))
            )}
          </div>
        </section>

        {/* Section: Đánh giá người dùng */}
        <section className="user-reviews-section">
          <h2>Đánh giá người dùng</h2>
          <div className="reviews-list">
            <div className="review-card">
              <img
                src="/images/user.jpg"
                alt="user1"
                className="review-avatar"
              />
              <div>
                <strong>Nguyễn Văn A</strong>
                <p>"Sân đẹp, đặt sân cực nhanh, giá hợp lý. Sẽ quay lại!"</p>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            <div className="review-card">
              <img
                src="/images/user.jpg"
                alt="user2"
                className="review-avatar"
              />
              <div>
                <strong>Trần Thị B</strong>
                <p>"Ứng dụng dễ dùng, nhiều lựa chọn sân gần nhà."</p>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
            <div className="review-card">
              <img
                src="/images/user.jpg"
                alt="user3"
                className="review-avatar"
              />
              <div>
                <strong>Lê Văn C</strong>
                <p>"Tôi rất hài lòng với dịch vụ chăm sóc khách hàng."</p>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Khuyến mãi đặc biệt */}
        <section className="promotion-section">
          <h2>Khuyến mãi đặc biệt</h2>
          <div className="promotion-banner">
            <img src="/images/promotional_banner.svg" alt="Khuyến mãi" />
            <div className="promo-content">
              <h3>Giảm 20% cho lần đặt sân đầu tiên!</h3>
              <p>
                Nhập mã <b>SIEUTOC20</b> khi đặt sân để nhận ưu đãi.
              </p>
              <button
                className="btn-dat-san"
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </section>

        {/* Section: Ứng dụng di động */}
        <section className="app-feature-section">
          <h2>Ứng dụng di động Sân Siêu Tốc</h2>
          <div className="app-feature-content">
            <img
              src="/images/app_mockup.png"
              alt="App Mobile"
              className="app-mockup"
            />
            <ul>
              <li>Đặt sân mọi lúc, mọi nơi chỉ với vài thao tác</li>
              <li>Nhận thông báo khuyến mãi nhanh nhất</li>
              <li>Quản lý lịch sử đặt sân dễ dàng</li>
              <li>Hỗ trợ khách hàng 24/7</li>
            </ul>
            <div className="app-download-links">
              <a href="#">
                <img src="/images/google-play-badge.png" alt="Google Play" />
              </a>
              <a href="#">
                <img src="/images/app-store-badge.svg" alt="App Store" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
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
        <style>{`
          .user-reviews-section {
            background: #f8f9fa;
            padding: 32px 0 24px 0;
            margin-top: 24px;
          }
          .user-reviews-section h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .reviews-list {
            display: flex;
            justify-content: center;
            gap: 32px;
            flex-wrap: wrap;
          }
          .review-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            padding: 18px 22px;
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 260px;
            max-width: 320px;
          }
          .review-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #00c853;
          }
          .promotion-section {
            background: linear-gradient(90deg, #00c853 60%, #ffd600 100%);
            color: #fff;
            padding: 32px 0;
            margin-top: 24px;
          }
          .promotion-section h2 {
            text-align: center;
            margin-bottom: 18px;
            color: #fff;
          }
          .promotion-banner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 32px;
            flex-wrap: wrap;
          }
          .promotion-banner img {
            width: 220px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .promo-content h3 {
            margin: 0 0 8px 0;
          }
          .promo-content p {
            margin-bottom: 12px;
          }
          .app-feature-section {
            background: #fffde7;
            padding: 32px 0;
            margin-top: 24px;
          }
          .app-feature-section h2 {
            text-align: center;
            margin-bottom: 18px;
          }
          .app-feature-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 40px;
            flex-wrap: wrap;
          }
          .app-mockup {
            width: 180px;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .app-feature-content ul {
            list-style: disc inside;
            margin: 0 0 12px 0;
            padding: 0;
            color: #333;
          }
          .app-download-links img {
            width: 120px;
            margin-right: 12px;
          }
        `}</style>
      </main>
    </div>
  );
}
