import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";
import "../../styles/AdminFieldList.css";

const PAGE_SIZE = 15;

const AdminFieldList = ({ user }) => {
    const [fields, setFields] = useState([]);
    const [filteredFields, setFilteredFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [fieldRes, bookingRes] = await Promise.all([
                    axios.get("http://localhost:5000/field/admin", {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }),
                    axios.get("http://localhost:5000/booking/admin/bookings", {
                        headers: { Authorization: `Bearer ${user.token}` },
                    }),
                ]);

                const fields = fieldRes.data;
                const bookings = bookingRes.data.bookings || bookingRes.data;

                const activeFieldIds = new Set();
                bookings.forEach((booking) => {
                    if (booking.status !== "cancelled") {
                        const fieldId =
                            typeof booking.fieldId === "string"
                                ? booking.fieldId
                                : booking.fieldId?._id;
                        if (fieldId) activeFieldIds.add(fieldId.toString());
                    }
                });

                const updatedFields = fields.map((field) => ({
                    ...field,
                    status: activeFieldIds.has(field._id.toString())
                        ? "Đang được đặt"
                        : "Trống",
                }));

                setFields(updatedFields);
                setFilteredFields(updatedFields);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [user]);

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
        setSearchTerm(keyword);
        const filtered = fields.filter((f) =>
            f.name.toLowerCase().includes(keyword)
        );
        setFilteredFields(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredFields.length / PAGE_SIZE);
    const paginatedFields = filteredFields.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="admin-container">
            <h1 className="admin-title">Sân Siêu Tốc - Quản lý Sân</h1>

            <div className="admin-header">
                <div className="admin-tabs">
                    <button className="tab" onClick={() => navigate("/admin")}>Tổng quan</button>
                    <button className="tab active">Quản lý Sân</button>
                    <button className="tab" onClick={() => navigate("/admin/owners")}>Chủ Sân</button>
                    <button className="tab" onClick={() => navigate("/admin/users")}>Người Dùng</button>
                    <button className="tab" onClick={() => navigate("/admin/bookings")}>Lịch Đặt</button>
                </div>

                <button
                    className="auth-button logout-button"
                    onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }}
                >
                    Đăng xuất
                </button>
            </div>

            <div className="field-list-toolbar">
                <h2>Danh sách sân</h2>
                <button className="add-button" onClick={() => navigate("/admin/fields/create")}>
                    Thêm sân
                </button>
            </div>

            {/* Tìm kiếm */}
            <div className="field-search">
                <input
                    type="text"
                    className="search-input-giant"
                    placeholder="🔍 Tìm kiếm tên sân..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Danh sách sân */}
            <div className="field-table">
                <div className="field-table-header">
                    <span>Tên sân</span>
                    <span>Chủ sân</span>
                    <span>Loại</span>
                    <span>Địa chỉ</span>
                    <span>Trạng thái</span>
                </div>

                {paginatedFields.map((field) => (
                    <div className="field-table-row" key={field._id}>
                        <span>{field.name}</span>
                        <span>{field.ownerId?.name || "Không rõ"}</span>
                        <span>{field.type?.name || "Không rõ"}</span>
                        <span>{field.address}</span>
                        <span
                            className={`status-label ${field.status === "Đang được đặt" ? "booked" : "available"
                                }`}
                        >
                            {field.status}
                        </span>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                        key={idx}
                        className={`page-button ${currentPage === idx + 1 ? "active" : ""}`}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminFieldList;
