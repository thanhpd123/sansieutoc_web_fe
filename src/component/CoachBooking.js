// src/pages/CoachBookingForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CoachBookingForm = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();

  const [coach, setCoach] = useState(null);
  const [loadingCoach, setLoadingCoach] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Form data
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    startTime: '',
    endTime: '',
    totalPrice: ''
  });

  // Giờ từ 8:00 đến 20:00
  const hours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

  // Lấy user từ localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('userData'));
      if (stored?.id && stored?.token) {
        setUser(stored);
      }
    } catch {
      localStorage.removeItem('userData');
    }
  }, []);

  // Fetch thông tin coach
  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await axios.get(`https://sansieutoc-web-be.onrender.com/coach/${coachId}`);
        setCoach(res.data);
      } catch (err) {
        console.error('Error fetching coach:', err);
        setMessage('❌ Không tìm thấy thông tin huấn luyện viên.');
      } finally {
        setLoadingCoach(false);
      }
    };
    fetchCoach();
  }, [coachId]);

  // Khi startTime hoặc endTime thay đổi, tính tổng tiền
  useEffect(() => {
    if (formData.startTime && formData.endTime && coach?.pricePerHour) {
      const startHour = parseInt(formData.startTime.split(':')[0], 10);
      const endHour = parseInt(formData.endTime.split(':')[0], 10);
      const duration = endHour - startHour;
      setFormData(prev => ({
        ...prev,
        totalPrice: duration > 0 ? duration * coach.pricePerHour : ''
      }));
    }
  }, [formData.startTime, formData.endTime, coach]);

  const handleSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'startTime' ? { endTime: '', totalPrice: '' } : {})
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user?.token) {
      setMessage('⚠️ Bạn cần đăng nhập để đặt lịch.');
      return;
    }

    const { date, startTime, endTime, totalPrice } = formData;
    if (!startTime || !endTime) {
      setMessage('⚠️ Vui lòng chọn đủ thời gian.');
      return;
    }
    const st = parseInt(startTime.split(':')[0], 10);
    const et = parseInt(endTime.split(':')[0], 10);
    if (et <= st) {
      setMessage('⚠️ Giờ kết thúc phải lớn hơn giờ bắt đầu.');
      return;
    }

    try {
      const payload = { coachId, date, startTime, endTime, totalPrice: Number(totalPrice) };
      await axios.post(
        'https://sansieutoc-web-be.onrender.com/coachbooking',
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage('✅ Đặt lịch thành công!');
      setTimeout(() => {
        navigate('/'); // chuyển về trang chính sau 1.5s
      }, 1500);
    } catch (err) {
      console.error('Error booking:', err);
      setMessage(err.response?.data?.message || '❌ Đặt lịch thất bại. Vui lòng thử lại.');
    }
  };

  if (loadingCoach) return <p className="loading">Đang tải thông tin huấn luyện viên…</p>;
  if (!coach) return <p className="error">{message || 'Không có thông tin huấn luyện viên.'}</p>;

  return (
    <div className="booking-form-container">
      <h1 className="title">Đặt lịch với {coach.name}</h1>
      <div className="coach-info">
        <img src={coach.image || '/images/default_coach.png'} alt={coach.name} className="coach-avatar" />
        <div className="coach-details">
          <p><strong>Chuyên môn:</strong> {coach.specialties.join(', ')}</p>
          <p><strong>Giá/giờ:</strong> {coach.pricePerHour.toLocaleString()} ₫</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Ngày:
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </label>
        <div className="time-selection">
          <div className="time-block">
            <p>Giờ bắt đầu:</p>
            <div className="time-buttons">
              {hours.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => handleSelect('startTime', slot)}
                  className={`time-btn ${formData.startTime === slot ? 'selected' : ''}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <div className="time-block">
            <p>Giờ kết thúc:</p>
            <div className="time-buttons">
              {formData.startTime
                ? hours
                  .filter(h => parseInt(h.split(':')[0], 10) > parseInt(formData.startTime.split(':')[0], 10))
                  .map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => handleSelect('endTime', slot)}
                      className={`time-btn ${formData.endTime === slot ? 'selected' : ''}`}
                    >
                      {slot}
                    </button>
                  ))
                : <p className="hint">Chọn giờ bắt đầu trước</p>
              }
            </div>
          </div>
        </div>
        <div className="total-price">
          <p><strong>Tổng tiền:</strong>&nbsp;
            {formData.totalPrice
              ? `${formData.totalPrice.toLocaleString()} ₫`
              : 'Chưa chọn đủ thời gian'}
          </p>
        </div>
        <button type="submit" className="btn-submit">Đặt lịch</button>
      </form>
      {message && <p className="feedback">{message}</p>}

      {/* CSS nội tuyến */}
      <style>{`
        .booking-form-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: 'Segoe UI', sans-serif;
          background: #f9fafb;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .title {
          text-align: center;
          font-size: 1.75rem;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        .coach-info {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }
        .coach-avatar {
          width: 100px;
          height: 100px;
          border-radius: 0.5rem;
          object-fit: cover;
          margin-right: 1rem;
        }
        .coach-details p {
          margin: 0.25rem 0;
          color: #374151;
        }
        .booking-form label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 500;
          color: #374151;
        }
        .booking-form input[type="date"] {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          margin-top: 0.25rem;
        }
        .time-selection {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .time-block p {
          margin: 0 0 0.5rem 0;
          font-weight: 500;
          color: #374151;
        }
        .time-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .time-btn {
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .time-btn:hover {
          background: #e5e7eb;
        }
        .time-btn.selected {
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        .hint {
          font-size: 0.85rem;
          color: #6b7280;
        }
        .total-price {
          margin: 1rem 0;
          font-size: 1rem;
          color: #374151;
        }
        .btn-submit {
          width: 100%;
          padding: 0.75rem;
          background: #10b981;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-submit:hover {
          background: #059669;
        }
        .feedback {
          margin-top: 1rem;
          text-align: center;
          color: #dc2626;
          font-weight: 500;
        }
        .loading {
          text-align: center;
          margin-top: 2rem;
          color: #6b7280;
        }
        .error {
          text-align: center;
          margin-top: 2rem;
          color: #dc2626;
        }
        @media (max-width: 640px) {
          .booking-form-container {
            margin: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CoachBookingForm;
