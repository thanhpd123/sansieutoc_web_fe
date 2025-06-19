import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../main/Home.css";
import SuccessBookingInfo from "./SuccessBookingInfo";

const fixedSlots = [
  { start: "07:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "11:00", end: "12:00" },
  { start: "13:00", end: "15:00" },
  { start: "15:00", end: "17:00" },
  { start: "17:00", end: "19:00" },
  { start: "19:00", end: "21:00" },
  { start: "21:00", end: "22:00" },
];

const Booking = () => {
  const { id: fieldId } = useParams();
  const navigate = useNavigate();

  const [field, setField] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fieldUnits, setFieldUnits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedList, setBookedList] = useState([]);

  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: today,
    totalPrice: "",
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (storedUser?.id && storedUser?.token) {
        setUser(storedUser);
      }
    } catch (err) {
      localStorage.removeItem("userData");
    }
  }, []);

  useEffect(() => {
    const fetchField = async () => {
      try {
        const res = await axios.get(`https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/field/${fieldId}`);
        setField(res.data);
      } catch (err) {
        setMessage("Không tìm thấy thông tin sân.");
      } finally {
        setLoading(false);
      }
    };
    fetchField();
  }, [fieldId]);

  useEffect(() => {
    axios
      .get(`https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/fieldunit/`)
      .then((res) => setFieldUnits(res.data))
      .catch(() => setFieldUnits([]));
  }, []);

  useEffect(() => {
    if (!fieldId || !formData.date) return;
    axios
      .get(`https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/booking`)
      .then((res) => setBookedSlots(res.data.bookings || []))
      .catch(() => setBookedSlots([]));
  }, [fieldId, formData.date]);

  useEffect(() => {
    if (selected.length > 0 && field) {
      let total = 0;
      selected.forEach(({ slot }) => {
        const startHour = parseInt(slot.start.split(":")[0], 10);
        const endHour = parseInt(slot.end.split(":")[0], 10);
        const duration = endHour - startHour;
        let pricePerHour = field.pricePerHour || 0;

        // Áp dụng giá đặc biệt theo yêu cầu
        if (
          (slot.start === "15:00" && slot.end === "17:00") ||
          (slot.start === "17:00" && slot.end === "19:00") ||
          (slot.start === "19:00" && slot.end === "21:00")
        ) {
          // Giữ nguyên giá gốc
          pricePerHour = field.pricePerHour || 0;
        } else if (
          (slot.start === "09:00" && slot.end === "10:00") ||
          (slot.start === "11:00" && slot.end === "12:00") ||
          (slot.start === "21:00" && slot.end === "22:00")
        ) {
          // Giảm 1 nửa giá
          pricePerHour = (field.pricePerHour || 0) / 2;
        } else if (slot.start === "07:00" && slot.end === "09:00") {
          // Lấy giá 1 nửa rồi giảm tiếp 1/3
          pricePerHour = ((field.pricePerHour || 0) / 2) * (2 / 3);
        }
        total += duration > 0 ? duration * pricePerHour : 0;
      });
      setFormData((f) => ({
        ...f,
        totalPrice: total,
      }));
    } else {
      setFormData((f) => ({
        ...f,
        totalPrice: "",
      }));
    }
  }, [selected, field]);

  const handleSelectCell = (slot, unit) => {
    if (!user) {
      setMessage("⚠️ Vui lòng đăng nhập để đặt sân.");
      return;
    }
    const exists = selected.find(
      (s) =>
        s.slot.start === slot.start &&
        s.slot.end === slot.end &&
        s.unit._id === unit._id
    );
    if (exists) {
      setSelected(
        selected.filter(
          (s) =>
            !(
              s.slot.start === slot.start &&
              s.slot.end === slot.end &&
              s.unit._id === unit._id
            )
        )
      );
    } else {
      setSelected([...selected, { slot, unit }]);
    }
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      setMessage("⚠️ Bạn cần đăng nhập để đặt sân.");
      return;
    }

    if (selected.length === 0) {
      setMessage("⚠️ Vui lòng chọn ít nhất 1 khung giờ và số sân.");
      return;
    }

    try {
      const bookings = selected.map(({ slot, unit }) => {
        const startHour = parseInt(slot.start.split(":")[0], 10);
        const endHour = parseInt(slot.end.split(":")[0], 10);
        const duration = endHour - startHour;
        let pricePerHour = field.pricePerHour || 0;

        if (
          (slot.start === "15:00" && slot.end === "17:00") ||
          (slot.start === "17:00" && slot.end === "19:00") ||
          (slot.start === "19:00" && slot.end === "21:00")
        ) {
          pricePerHour = field.pricePerHour || 0;
        } else if (
          (slot.start === "09:00" && slot.end === "10:00") ||
          (slot.start === "11:00" && slot.end === "12:00") ||
          (slot.start === "21:00" && slot.end === "22:00")
        ) {
          pricePerHour = (field.pricePerHour || 0) / 2;
        } else if (slot.start === "07:00" && slot.end === "09:00") {
          pricePerHour = ((field.pricePerHour || 0) / 2) * (2 / 3);
        }

        return {
          fieldId,
          fieldUnitId: unit._id,
          unitNumber: unit.unitNumber,
          date: formData.date,
          startTime: slot.start,
          endTime: slot.end,
          totalPrice: duration > 0 ? duration * pricePerHour : 0,
          status: "pending",
        };
      });

      for (const payload of bookings) {
        await axios.post("https://zkoo0400gsgowowok84o8cck.qroma.tinkering.vn/booking", payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }

      setBookedList(bookings);
      setShowSuccess(true);
      setMessage("");
      setSelected([]);
      setFormData((f) => ({ ...f, totalPrice: "" }));
    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Đặt sân thất bại. Vui lòng thử lại."
      );
    }
  };

  const renderBookingTable = () => (
    <div className="form-group">
      <label>Chọn khung giờ & số sân:</label>
      <div className="booking-table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>Khung giờ</th>
              {fieldUnits.map((unit) => (
                <th key={unit._id}>Sân {unit.unitNumber}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fixedSlots.map((slot, idx) => (
              <tr key={idx}>
                <td>
                  {slot.start} - {slot.end}
                </td>
                {fieldUnits.map((unit) => {
                  const isBooked = bookedSlots.some(
                    (b) =>
                      b.startTime === slot.start &&
                      b.endTime === slot.end &&
                      (b.fieldUnitId?.$oid === unit._id ||
                        b.fieldUnitId === unit._id ||
                        b.fieldUnitId?._id === unit._id)
                  );
                  const isSelected = selected.some(
                    (s) =>
                      s.slot.start === slot.start &&
                      s.slot.end === slot.end &&
                      s.unit._id === unit._id
                  );
                  return (
                    <td key={unit._id}>
                      <button
                        type="button"
                        disabled={isBooked || !user}
                        onClick={() => handleSelectCell(slot, unit)}
                        className={`unit-btn-table ${isBooked ? "booked" : ""
                          } ${isSelected ? "selected" : ""}`}
                      >
                        {isBooked ? "Đã đặt" : isSelected ? "Đã chọn" : "Trống"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) return <p className="p-4">Đang tải thông tin sân...</p>;
  if (!field)
    return (
      <p className="p-4 text-red-600">{message || "Không có thông tin sân."}</p>
    );

  return (
    <div className="font-sans">
      {/* Header giữ nguyên */}
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
          <Link to="/">Trang Chủ</Link>
          <Link to="/coach">Huấn Luyện Viên Cá Nhân</Link>
          <Link to="#">Dụng Cụ Thể Thao</Link>
          <Link to="/coachbookinghistory">Lịch Đặt Huấn Luyện Viên</Link>
          <Link to="/lichsu-datsan">Lịch Sử</Link>
        </nav>
        <div className="auth-search">
          {user ? (
            <>
              <span className="user-name">Xin chào, {user.name}!</span>
              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("userData");
                  setUser(null);
                  navigate("/");
                }}
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

      {/* Main booking content */}
      <main className="content-wrapper">
        <div className="booking-container">
          <div className="booking-card">
            {showSuccess ? (
              <SuccessBookingInfo
                bookedList={bookedList}
                field={field}
                user={user}
                onClose={() => setShowSuccess(false)}
              />
            ) : (
              <>
                <div className="booking-field-info">
                  <div className="booking-image">
                    {field.images?.length > 0 ? (
                      <img src={field.images[0]} alt={field.name} />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                  </div>
                  <div className="booking-field-details">
                    <h1 className="booking-title">{field.name}</h1>
                    <p className="booking-address">{field.address}</p>
                    <p className="booking-type">
                      Loại sân: <b>{field.type?.name || "N/A"}</b>
                    </p>
                    <p className="booking-price">
                      Giá thuê:{" "}
                      <b>
                        {typeof field.pricePerHour === "number"
                          ? Math.round(field.pricePerHour).toLocaleString() +
                          " ₫/giờ"
                          : "Không rõ"}
                      </b>
                    </p>
                  </div>
                </div>
                <div className="booking-form-section">
                  {user ? (
                    <>
                      <p className="booking-user">
                        Người đặt: <b>{user.name}</b>
                      </p>
                      <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-group">
                          <label>Ngày:</label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                date: e.target.value,
                                totalPrice: "",
                              });
                              setSelected([]);
                            }}
                            required
                          />
                        </div>
                        {renderBookingTable()}
                        <div className="form-group">
                          <label>Tổng tiền:</label>
                          <div className="booking-total">
                            {formData.totalPrice
                              ? Math.round(
                                formData.totalPrice
                              ).toLocaleString() + " ₫"
                              : "Chưa chọn khung giờ và sân"}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn-dat-san booking-submit-btn"
                        >
                          Thanh Toán
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="booking-login-reminder">
                      <p>⚠️ Vui lòng đăng nhập để đặt sân.</p>
                      <button
                        onClick={() => navigate("/login")}
                        className="booking-login-btn"
                      >
                        → Chuyển đến trang đăng nhập
                      </button>
                    </div>
                  )}
                  {message && <p className="booking-message">{message}</p>}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Footer giữ nguyên */}
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
      </main>
      <style>
        {`
        .booking-table-wrapper {
          overflow-x: auto;
          margin-bottom: 16px;
        }
        .booking-table {
          width: 100%;
          border-collapse: collapse;
          text-align: center;
        }
        .booking-table th, .booking-table td {
          border: 1px solid #ddd;
          padding: 6px 4px;
        }
        .unit-btn-table.selected {
          background: #2ecc40;
          color: #fff;
        }
        .unit-btn-table.booked {
          background: #ccc;
          color: #888;
          cursor: not-allowed;
        }
        .unit-btn-table {
          min-width: 60px;
          padding: 4px 0;
          border: none;
          background: #eee;
          border-radius: 4px;
          cursor: pointer;
        }
        body {
          background: linear-gradient(120deg, #e0ffe8 0%, #f6f8fa 100%);
        }
            html, body, #root, .page-wrapper {
        height: 100%;
        min-height: 100vh;
      }
      .page-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .content-wrapper {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
      }
      .main-footer {
        flex-shrink: 0;
      }
        .booking-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: transparent;
  padding: 24px 0 0 0;
  
}
        .booking-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 8px 32px rgba(26,127,55,0.13), 0 1.5px 6px rgba(44,204,64,0.07);
          padding: 38px 38px 28px 38px;
          max-width: 950px;
          width: 100%;
          margin: 0 auto;
          transition: box-shadow 0.2s;
        }
        .booking-card:hover {
          box-shadow: 0 12px 40px rgba(26,127,55,0.18), 0 2px 8px rgba(44,204,64,0.10);
        }
        .booking-field-info {
          display: flex;
          gap: 36px;
          align-items: flex-start;
          margin-bottom: 36px;
        }
        .booking-image img, .booking-image .no-image {
          width: 250px;
          height: 170px;
          object-fit: cover;
          border-radius: 16px;
          background: linear-gradient(135deg, #e0ffe8 0%, #eaeaea 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          color: #888;
          box-shadow: 0 2px 12px rgba(44,204,64,0.08);
        }
        .booking-field-details {
          flex: 1;
        }
        .booking-title {
          font-size: 2.2rem;
          font-weight: bold;
          margin-bottom: 10px;
          color: #1a7f37;
          letter-spacing: 1px;
        }
        .booking-address {
          color: #555;
          margin-bottom: 8px;
          font-size: 1.08rem;
        }
        .booking-type, .booking-price {
          margin-bottom: 7px;
          color: #222;
          font-size: 1.08rem;
        }
        .booking-form-section {
          margin-top: 16px;
        }
        .booking-user {
          font-size: 1.13rem;
          margin-bottom: 12px;
          color: #1a7f37;
        }
        .booking-form {
          margin-top: 10px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          font-weight: 600;
          margin-bottom: 5px;
          display: block;
          color: #1a7f37;
        }
        .booking-table-wrapper {
          overflow-x: auto;
          margin-bottom: 18px;
        }
        .booking-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: center;
          background: #fafdff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(44,204,64,0.07);
        }
        .booking-table th, .booking-table td {
          border: 1px solid #e0e0e0;
          padding: 10px 6px;
        }
        .booking-table th {
          background: linear-gradient(90deg, #e9f5ee 60%, #d0f5e2 100%);
          color: #1a7f37;
          font-weight: 700;
          font-size: 1.08rem;
        }
        .unit-btn-table.selected {
          background: linear-gradient(90deg, #1a7f37 60%, #2ecc40 100%);
          color: #fff;
          font-weight: bold;
          border: 2px solid #1a7f37;
          box-shadow: 0 2px 8px rgba(44,204,64,0.10);
          transform: scale(1.06);
        }
        .unit-btn-table.booked {
          background: #e0e0e0;
          color: #888;
          cursor: not-allowed;
          border: 2px solid #e0e0e0;
          text-decoration: line-through;
        }
        .unit-btn-table {
          min-width: 80px;
          padding: 10px 0;
          border: 2px solid #d0e6d7;
          background: #f6f8fa;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s;
          font-size: 1.07rem;
          font-family: inherit;
          font-weight: 500;
          outline: none;
        }
        .unit-btn-table:not(.booked):hover {
          background: linear-gradient(90deg, #b6f5c1 60%, #e0ffe8 100%);
          border-color: #1a7f37;
          color: #1a7f37;
          box-shadow: 0 2px 8px rgba(44,204,64,0.13);
          transform: scale(1.04);
        }
        .booking-total {
          font-size: 1.25rem;
          font-weight: bold;
          color: #1a7f37;
          letter-spacing: 0.5px;
        }
        .booking-submit-btn {
          background: linear-gradient(90deg, #1a7f37 60%, #2ecc40 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 14px 44px;
          font-size: 1.13rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 12px;
          box-shadow: 0 2px 8px rgba(26,127,55,0.10);
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.5px;
        }
        .booking-submit-btn:hover {
          background: linear-gradient(90deg, #2ecc40 60%, #1a7f37 100%);
          transform: scale(1.04);
        }
        .booking-message {
          margin-top: 16px;
          font-size: 1.08rem;
          color: #e74c3c;
          font-weight: 500;
        }
        .booking-login-reminder {
          background: #fffbe6;
          border: 1.5px solid #ffe58f;
          padding: 22px;
          border-radius: 10px;
          margin-top: 22px;
          text-align: center;
          font-size: 1.08rem;
        }
        .booking-login-btn {
          background: linear-gradient(90deg, #1a7f37 60%, #2ecc40 100%);
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 28px;
          font-size: 1.07rem;
          margin-top: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s, transform 0.15s;
        }
        .booking-login-btn:hover {
          background: linear-gradient(90deg, #2ecc40 60%, #1a7f37 100%);
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .booking-card {
            padding: 18px 6px 18px 6px;
          }
          .booking-field-info {
            flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
          .booking-image img, .booking-image .no-image {
            width: 100%;
            height: 180px;
          }
        }
       
        `}
      </style>
    </div>
  );
};

export default Booking;
