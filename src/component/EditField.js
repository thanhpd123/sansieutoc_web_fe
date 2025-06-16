import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../main/CreateField.css";

export default function EditField({ user }) {
  const navigate = useNavigate();
  const { id } = useParams();

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
    if (!user) return;

    axios
      .get(`/field/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const field = res.data;
        setFormData({
          name: field.name || "",
          type: field.type || "",
          address: field.address || "",
          description: field.description || "",
          pricePerHour: field.pricePerHour?.toString() || "",
          images: field.images || [],
          availableTimes: field.availableTimes || [],
        });
      })
      .catch((err) => {
        console.error("Lỗi khi load field:", err);
      });
  }, [id, user]);

  useEffect(() => {
    axios
      .get("/type")
      .then((res) => setTypes(res.data))
      .catch((err) => console.error("Lỗi khi load types:", err));
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
        headers: { "Content-Type": "multipart/form-data" },
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

  const handleRemoveImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
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

  const handleRemoveTime = (index) => {
    const times = [...formData.availableTimes];
    times.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      availableTimes: times,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        pricePerHour: parseInt(formData.pricePerHour),
      };

      await axios.put(`/field/${id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert("Cập nhật sân thành công!");
      navigate("/manager/fields");
    } catch (err) {
      console.error("Lỗi cập nhật sân:", err);
      alert("Cập nhật sân thất bại!");
    }
  };

  return (
    <div className="create-field-container">
      <h2 className="form-title">Chỉnh sửa Sân</h2>
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
          <input
            name="pricePerHour"
            type="number"
            value={formData.pricePerHour}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ảnh hiện tại:</label>
          <div className="preview-images">
            {formData.images.map((url, idx) => (
              <div key={idx} className="image-item">
                <img src={url} alt={`img-${idx}`} className="thumbnail" />
                <button type="button" onClick={() => handleRemoveImage(url)}>X</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Thêm ảnh mới:</label>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>

        <div className="form-group">
          <label>Khung giờ khả dụng:</label>
          <ul>
            {formData.availableTimes.map((time, index) => (
              <li key={index}>
                {time}{" "}
                <button type="button" onClick={() => handleRemoveTime(index)}>X</button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleAddTime}> Thêm khung giờ</button>
        </div>

        <div className="form-buttons">
          <button type="submit" className="auth-button">Lưu thay đổi</button>
          <button
            type="button"
            onClick={() => navigate("/manager/fields")}
            className="auth-button secondary"
          >
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
}
