// src/pages/Coaches.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../Home.css";

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook để điều hướng

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // Gọi API GET /coach để lấy danh sách
        const res = await axios.get("http://zkoo0400gsgowowok84o8cck.185.210.144.237.sslip.io/coach");
        setCoaches(res.data);
      } catch (err) {
        console.error("Error fetching coaches:", err);
        setError(
          "❌ Không thể tải danh sách huấn luyện viên. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  if (loading) {
    return <p className="loading">Đang tải danh sách huấn luyện viên…</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  // Hàm xử lý khi bấm nút "Đặt lịch"
  const handleBook = (coachId) => {
    // Redirect tới trang booking của coach (ví dụ: /coach/<coachId>/booking)
    navigate(`/coach/${coachId}/booking`);
  };

  return (
    <div className="font-sans">
      {/* Header Premium Style */}
      <header className="navbar">
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
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
          <a href="/">Trang chủ</a>
          <a href="/coach">Huấn luyện viên cá nhân</a>
          <a href="#">Dụng cụ thể thao</a>
          <a href="/coachbookinghistory">Lịch Đặt Huấn Luyện Viên</a>
          <a href="/lichsu-datsan">Lịch sử</a>
        </nav>
        <div className="auth-search">
          {/* Tuỳ chỉnh đăng nhập/đăng xuất nếu cần */}
        </div>
      </header>

      {/* Banner Premium */}
      <section
        className="coaches-banner-animate"
        style={{
          width: "100%",
          position: "relative",
          marginTop: "60px",
          marginBottom: "15px",
          background: "#e5e5e5",
          borderRadius: "0 0 2rem 2rem",
          overflow: "hidden",
          animation: "fadeInScale 0.7s cubic-bezier(.4,2,.6,1) both",
        }}
      >
        <img
          src="/images/a.png"
          alt="Banner"
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
              letterSpacing: 1,
            }}
          >
            Danh sách Huấn luyện viên
          </h1>
          <p
            style={{
              marginTop: 16,
              fontSize: "1.1rem",
              textShadow: "0 1px 6px #2226",
            }}
          >
            Đội ngũ huấn luyện viên chuyên nghiệp, tận tâm, sẵn sàng đồng hành cùng
            bạn trên hành trình thể thao!
          </p>
        </div>
      </section>

      {/* Coaches Premium Grid */}
      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {loading ? (
          <p className="loading">Đang tải danh sách huấn luyện viên…</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : coaches.length === 0 ? (
          <p className="no-data">Hiện chưa có huấn luyện viên nào.</p>
        ) : (
          <div
            className="coaches-premium-grid"
            style={{
              opacity: 0,
              animation: "fadeInUp 0.7s 0.15s cubic-bezier(.4,2,.6,1) forwards",
            }}
          >
            {coaches.map((coach, idx) => (
              <div
                key={coach._id}
                className="coach-premium-card"
                style={{
                  animation: `cardStaggerIn 0.55s cubic-bezier(.4,2,.6,1) both`,
                  animationDelay: `${0.08 * idx + 0.25}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="coach-avatar-premium"
                  onClick={() => handleBook(coach._id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={coach.image || "/images/default_coach.png"}
                    alt={coach.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1.2rem 1.2rem 0 0",
                    }}
                  />
                </div>
                <div className="coach-premium-info">
                  <h3 className="coach-premium-name">{coach.name}</h3>
                  <div className="coach-premium-specialties">
                    {coach.specialties && coach.specialties.length > 0
                      ? coach.specialties.join(", ")
                      : "Chưa cập nhật"}
                  </div>
                  <div className="coach-premium-rating">
                    <span>⭐ {(coach.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="coach-premium-contact">
                    <span>
                      <img
                        src="https://img.icons8.com/ios-filled/18/00c853/secured-letter.png"
                        alt="email"
                        style={{
                          verticalAlign: "middle",
                          marginRight: 4,
                        }}
                      />
                      {coach.email}
                    </span>
                    <span>
                      <img
                        src="https://img.icons8.com/ios-filled/18/00c853/phone.png"
                        alt="phone"
                        style={{
                          verticalAlign: "middle",
                          marginRight: 4,
                        }}
                      />
                      {coach.phone}
                    </span>
                  </div>
                  <div className="coach-premium-price">
                    <span>
                      Giá/giờ:{" "}
                      <b>{coach.pricePerHour.toLocaleString()} ₫</b>
                    </span>
                  </div>
                  {coach.description && (
                    <div className="coach-premium-desc">
                      <i>{coach.description}</i>
                    </div>
                  )}
                  {coach.availableTimes && coach.availableTimes.length > 0 && (
                    <div className="coach-premium-times">
                      <span>
                        Thời gian trống:{" "}
                        {coach.availableTimes.join(", ")}
                      </span>
                    </div>
                  )}
                  <button
                    className="btn-dat-san"
                    style={{ marginTop: 16, width: "100%" }}
                    onClick={() => handleBook(coach._id)}
                  >
                    Đặt lịch huấn luyện viên
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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
        .coaches-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin: 32px 0 48px 0;
        }
        .coach-premium-card {
          background: #fff;
          border-radius: 1.2rem;
          box-shadow: 0 8px 32px rgba(0, 200, 83, 0.13),
            0 1.5px 8px rgba(0, 0, 0, 0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.22s, transform 0.18s;
          border: 1.5px solid #e0ffe0;
          cursor: pointer;
          position: relative;
        }
        .coach-premium-card:hover {
          box-shadow: 0 24px 64px #00c85333, 0 8px 32px #ffd60033;
          border-color: #ffd600;
          transform: translateY(-10px) scale(1.03) rotate(-1deg);
          background: linear-gradient(120deg, #fff 80%, #e0ffe0 100%);
        }
        .coach-avatar-premium {
          width: 100%;
          height: 210px;
          background: #e0e0e0;
          overflow: hidden;
          border-radius: 1.2rem 1.2rem 0 0;
        }
        .coach-premium-info {
          padding: 1.2rem 1.2rem 1.5rem 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .coach-premium-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #00c853;
          margin-bottom: 0.4rem;
        }
        .coach-premium-specialties {
          font-size: 1rem;
          color: #009624;
          margin-bottom: 0.5rem;
        }
        .coach-premium-rating {
          font-size: 1rem;
          color: #ffd600;
          margin-bottom: 0.5rem;
        }
        .coach-premium-contact {
          font-size: 0.97rem;
          color: #333;
          margin-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .coach-premium-price {
          font-size: 1rem;
          color: #00c853;
          margin-bottom: 0.5rem;
        }
        .coach-premium-desc {
          font-size: 0.96rem;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }
        .coach-premium-times {
          font-size: 0.95rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 700px) {
          .coach-avatar-premium {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default Coaches;
