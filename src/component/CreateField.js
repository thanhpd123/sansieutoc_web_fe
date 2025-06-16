import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../main/CreateField.css";

export default function CreateField({ user }) {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
    pricePerHour: "",
    images: [],
    availableTimes: [],
  });

  useEffect(() => {
    axios
      .get("/type")
      .then((res) => setTypes(res.data))
      .catch((err) => console.error("Lỗi load loại sân:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.imageUrl) {
        uploadedUrls.push(res.data.imageUrl);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
  };

  const handleAddTime = () => {
    const time = prompt("Nhập khung giờ (VD: 08:00-10:00)");
    if (time) {
      setFormData((prev) => ({
        ...prev,
        availableTimes: [...prev.availableTimes, time],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ownerId: user.id,
        pricePerHour: parseInt(formData.pricePerHour),
      };

      await axios.post("/field", payload);
      alert("Tạo sân thành công!");
      navigate("/manager/fields");
    } catch (err) {
      console.error("Lỗi tạo sân:", err.response?.data || err.message);
      alert("Tạo sân thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  if (!user || !user.id) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className="create-field-container">
      <h2 className="form-title">Tạo Sân Mới</h2>
      <form className="field-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sân:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Loại sân:</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="">-- Chọn loại sân --</option>
            {types.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Địa chỉ:</label>
          <input name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mô tả:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Giá thuê theo giờ (VNĐ):</label>
          <input name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Ảnh (có thể chọn nhiều):</label>
          <input type="file" multiple onChange={handleImageUpload} />
          <div className="preview-images">
            {formData.images.map((url, idx) => (
              <img key={idx} src={url} alt={`img-${idx}`} className="thumbnail" />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Khung giờ khả dụng:</label>
          <ul>
            {formData.availableTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
          <button type="button" onClick={handleAddTime}>
             Thêm khung giờ
          </button>
        </div>

        <div className="form-buttons">
          <button type="submit" className="auth-button">Tạo sân</button>
          <button type="button" onClick={() => navigate("/manager/fields")} className="auth-button secondary">
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}
