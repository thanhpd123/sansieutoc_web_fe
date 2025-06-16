import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessBookingInfo = ({ bookedList, field, user }) => {
  const [showQR, setShowQR] = useState(true);
  const [showSuccessText, setShowSuccessText] = useState(false);
  const total = bookedList.reduce((sum, b) => sum + b.totalPrice, 0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowQR(false);
      setShowSuccessText(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="booking-success"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        padding: 32,
        marginTop: 24,
        textAlign: "left",
      }}
    >
      <h1
        style={{
          color: "#1a7f37",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        🎉 Thông tin đặt sân!
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <div>
          <div>
            <b>Ngày đặt:</b> {bookedList[0]?.date || "--"}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Khung giờ đặt:</b>
            <ul style={{ margin: "6px 0 0 18px" }}>
              {bookedList.map((b, idx) => (
                <li key={idx}>
                  {b.startTime} - {b.endTime} - Sân {b.unitNumber}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Bắt buộc phải thanh toán 30% sân</b> 
          </div>
        </div>
        <div>
          <div>
            <b>Loại sân:</b> {field?.type?.name || "Sân Bóng Đá"}
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Tiền cọc (30%):</b>
            <br />
            <span style={{ color: "#1a7f37", fontWeight: 600 }}>
              {(total * 0.3).toLocaleString()} ₫
            </span>
          </div>
          <div style={{ marginTop: 8 }}>
            <b>Cần thanh toán (70%):</b>
            <br />
            <span style={{ color: "#e67e22", fontWeight: 600 }}>
              {(total * 0.7).toLocaleString()} ₫
            </span>
          </div>
        </div>
      </div>
      <div style={{ margin: "18px 0 8px 0" }}>
        <b>Chuyển khoản qua ngân hàng:</b>
        <div style={{ margin: "16px 0", textAlign: "center" }}>
          {showQR && (
            <>
              <img
                src="/images/QR.png"
                alt="QR chuyển khoản"
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 12,
                  border: "2px solid #1a7f37",
                }}
              />
              <div
                style={{
                  fontSize: "1.05rem",
                  color: "#555",
                  marginTop: 10,
                }}
              >
                Nội dung chuyển khoản: <b>{user?.name} - {field?.name}</b>
              </div>
            </>
          )}
          {showSuccessText && (
            <div
              style={{
                color: "#1a7f37",
                fontWeight: 700,
                fontSize: 22,
                marginTop: 24,
                marginBottom: 16,
              }}
            >
              ✅ Đã đặt sân thành công!
            </div>
          )}
          {showSuccessText && (
            <button
              className="booking-submit-btn"
              style={{ marginTop: 18 }}
              onClick={() => navigate("/")}
            >
              Đặt tiếp sân khác
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessBookingInfo;