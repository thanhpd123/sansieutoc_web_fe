import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../main/CoachBookingHistory.module.css'; // optional: CSS Module

const CoachBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/coachbooking/user', {
          headers: {
           Authorization: `Bearer ${JSON.parse(localStorage.getItem('userData'))?.token}`,

          },
        });
        setBookings(response.data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Đang tải lịch sử đặt huấn luyện viên...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bookings.length === 0) return <p>Chưa có lịch đặt huấn luyện viên nào.</p>;

  return (
    <div className={styles.container || 'max-w-4xl mx-auto p-4'}>
      <h2 className="text-2xl font-semibold mb-4">Lịch sử đặt huấn luyện viên</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={booking.coachId.image}
                alt={booking.coachId.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-bold">{booking.coachId.name}</h3>
                <p className="text-sm text-gray-600">{booking.coachId.specialties.join(', ')}</p>
              </div>
            </div>

            <div className="mt-3">
              <p><strong>Ngày:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Thời gian:</strong> {booking.startTime} - {booking.endTime}</p>
              <p><strong>Giá:</strong> {booking.totalPrice.toLocaleString()}đ</p>
              <p><strong>Trạng thái:</strong> 
                <span className={
                  booking.status === 'pending' ? 'text-yellow-500' :
                  booking.status === 'confirmed' ? 'text-green-600' :
                  'text-red-500'
                }>
                  {' '}{booking.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachBookingHistory;
  
