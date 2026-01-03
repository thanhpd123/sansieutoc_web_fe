import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Login.module.css";

export default function Login() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("login");
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    // Kiểm tra localStorage khi component được mount
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                console.log("Đã đăng nhập:", parsedUser);
            } catch (err) {
                console.error("Dữ liệu localStorage không hợp lệ", err);
                localStorage.removeItem("userData");
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError("");
        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("userData");
        setUser(null);
        alert("Đã đăng xuất");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.email || !formData.password) {
            setError("Vui lòng nhập email và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            setLoading(false);
            if (response.data && response.data.token) {
                const userData = {
                    ...response.data.user,
                    token: response.data.token,
                };

                localStorage.setItem("userData", JSON.stringify(userData));
                setUser(userData);
                alert("Đăng nhập thành công!");
                if (userData.role === "manager") {
                    navigate("/manager/fields");
                } else if (userData.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(response.data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.request) {
                setError("Không thể kết nối đến máy chủ.");
            } else {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
            console.error("Login error:", err);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { name, email, password, phone, address } = formData;

        if (!name || !email || !password || !phone || !address) {
            setError("Vui lòng điền đầy đủ thông tin.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/register", {
                name,
                email,
                password,
                phone,
                address,
            });

            setLoading(false);

            if (response.data?.success) {
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                handleTabChange("login");
            } else {
                setError(response.data.message || "Đăng ký thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            setLoading(false);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
            console.error("Register error:", err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span role="img" aria-label="stadium" className={styles.logo}>🏟️</span>
                    <h2>Sân Thể Thao</h2>
                    <p>Hệ thống quản lý đặt sân thể thao</p>
                </div>

                {user && (
                    <div style={{ background: "#e3f2fd", padding: "10px", borderRadius: "8px", marginBottom: "1rem" }}>
                        <p>🔒 Bạn đang đăng nhập với tên: <strong>{user.name}</strong></p>
                        <p>Email: {user.email}</p>
                        <button onClick={handleLogout} style={{ marginTop: "10px" }}>Đăng Xuất</button>
                    </div>
                )}

                <div className={styles.tabs}>
                    <span
                        className={`${styles.tab} ${activeTab === "login" ? styles.active : ""}`}
                        onClick={() => handleTabChange("login")}
                    >
                        Đăng Nhập
                    </span>
                    <span
                        className={`${styles.tab} ${activeTab === "register" ? styles.active : ""}`}
                        onClick={() => handleTabChange("register")}
                    >
                        Đăng Ký
                    </span>
                </div>

                {activeTab === "login" && (
                    <form className={styles.form} onSubmit={handleLogin}>
                        <label htmlFor="email">Email hoặc Tên đăng nhập</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Nhập email hoặc tên đăng nhập"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {error && <p className={styles.errorText}>{error}</p>}

                        <div className={styles.checkboxGroup}>
                            <input type="checkbox" id="remember" disabled={loading} />
                            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                        </div>

                        <button type="submit" className={styles.loginBtn} disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng Nhập"}
                        </button>
                    </form>
                )}

                {activeTab === "register" && (
                    <form className={styles.form} onSubmit={handleRegister}>
                        <label htmlFor="name">Họ và Tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nhập họ tên"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Nhập địa chỉ"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {error && <p className={styles.errorText}>{error}</p>}

                        <button type="submit" className={styles.loginBtn} disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng Ký"}
                        </button>
                    </form>
                )}

                <div className={styles.divider}>hoặc</div>

                <div className={styles.socialButtons}>
                    <button className={styles.google} disabled={loading}>Google</button>
                    <button className={styles.facebook} disabled={loading}>Facebook</button>
                </div>
            </div>
        </div>
    );
}
