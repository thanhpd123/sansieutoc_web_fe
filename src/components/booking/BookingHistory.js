import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
// QUAN TRỌNG: File này dùng src/Home.css (không phải main/Home.css)
// Nên import HomeRoot.css (bản copy của src/Home.css)
import "../../styles/HomeRoot.css";

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('userData'));
            if (storedUser?.id && storedUser?.token) {
                setUser(storedUser);
            } else {
                setError('⚠️ Bạn cần đăng nhập để xem lịch sử đặt sân.');
                setLoading(false);
            }
        } catch (err) {
            setError('⚠️ Lỗi khi lấy thông tin người dùng.');
            localStorage.removeItem('userData');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user?.token) return;

            try {
                const res = await axios.get('http://localhost:5000/booking', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setBookings(res.data.bookings || []);
            } catch (err) {
                console.error(err);
                setError('❌ Không thể tải lịch sử đặt sân. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) return <p className="loading">Đang tải lịch sử đặt sân...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Bạn chắc chắn muốn hủy lượt đặt sân này?")) return;
        try {
            await axios.patch(
                `http://localhost:5000/booking/${bookingId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === bookingId ? { ...b, status: "cancelled" } : b
                )
            );
        } catch (err) {
            alert("Không thể hủy đặt sân. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="font-sans">
            {/* Header giống Home */}
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
                    <Link to="/">Trang chủ</Link>
                    <Link to="/coach">Huấn luyện viên cá nhân</Link>
                    <Link to="#">Dụng cụ thể thao</Link>
                    <Link to="/coachbookinghistory">Lịch Đặt Huấn Luyện Viên</Link>
                    <Link to="/lichsu-datsan">Lịch sử</Link>
                </nav>
                <div className="auth-search"></div>
            </header>

            {/* Banner Premium giữ nguyên */}
            <section
                style={{
                    width: "100%",
                    position: "relative",
                    marginTop: "60px",
                    marginBottom: "15px",
                    background: "#e5e5e5",
                    borderRadius: "0 0 2rem 2rem",
                    overflow: "hidden",
                }}
            >
                <img
                    src="/images/a.png"
                    alt="Banner"
                    style={{
                        width: "100%",
                        height: "220px",
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
                            fontSize: "2rem",
                            margin: 0,
                            textShadow: "0 2px 8px #2228",
                            color: "#fff",
                            letterSpacing: 1,
                        }}
                    >
                        Lịch sử đặt sân
                    </h1>
                    <p
                        style={{
                            marginTop: 12,
                            fontSize: "1.05rem",
                            textShadow: "0 1px 6px #2226",
                        }}
                    >
                        Xem lại các lượt đặt sân của bạn, quản lý lịch sử và trạng thái đặt sân dễ dàng!
                    </p>
                </div>
            </section>

            <div className="booking-history-container">
                {bookings.length === 0 ? (
                    <p className="no-bookings">Bạn chưa có lượt đặt sân nào.</p>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <h3 className="field-name">🏟️ {booking.fieldId?.name || 'Tên sân'}</h3>
                            <p className="info">
                                📍 <strong>Địa chỉ:</strong> {booking.fieldId?.address || 'Không rõ'}
                            </p>
                            <p className="info">
                                📅 <strong>Ngày:</strong> {booking.date}
                            </p>
                            <p className="info">
                                ⏰ <strong>Giờ:</strong> {booking.startTime} - {booking.endTime}
                            </p>
                            <p className="info">
                                💰 <strong>Tổng tiền:</strong> {booking.totalPrice?.toLocaleString()} ₫
                            </p>
                            <p className="info">
                                📌 <strong>Trạng thái:</strong>{' '}
                                <span className={`status ${booking.status}`}>
                                    {booking.status}
                                </span>
                            </p>
                            {/* Nút hủy sân */}
                            {booking.status !== "cancelled" && (
                                <button
                                    className="cancel-btn"
                                    onClick={() => handleCancelBooking(booking._id)}
                                >
                                    Hủy sân
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer giống Home */}
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
        .booking-history-container {
          padding: 1rem;
          max-width: 1000px;
          margin: 0 auto;
          font-family: 'Segoe UI', sans-serif;
        }

        .heading {
          font-size: 1.75rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .no-bookings {
          color: #4b5563;
          font-style: italic;
        }

        .error {
          padding: 1rem;
          color: #dc2626;
          font-weight: 500;
        }

        .loading {
          padding: 1rem;
          font-weight: 500;
        }

        .booking-card {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .booking-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .cancel-btn {
          background: #dc2626;
          color: #fff;
          border: none;
          padding: 7px 18px;
          border-radius: 5px;
          font-weight: 500;
          margin-top: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .cancel-btn:hover {
          background: #b91c1c;
        }

        .field-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .info {
          font-size: 0.9rem;
          color: #374151;
          margin-bottom: 0.4rem;
        }

        .status {
          font-weight: 600;
          text-transform: capitalize;
        }

        .status.pending {
          color: #ca8a04;
        }

        .status.confirmed {
          color: #16a34a;
        }

        .status.cancelled {
          color: #dc2626;
        }

        @media (max-width: 640px) {
          .heading {
            font-size: 1.3rem;
          }

          .field-name {
            font-size: 1.1rem;
          }

          .info {
            font-size: 0.8rem;
          }
        }
      `}</style>
        </div>
    );
};

export default BookingHistory;
