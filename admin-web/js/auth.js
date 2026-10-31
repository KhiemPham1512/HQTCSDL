async function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("full_name");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    window.location.href = window.location.pathname.includes("/pages/") ? "../login.html" : "login.html";
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = document.getElementById("loginMessage");
        const button = document.getElementById("loginButton");
        const identifier = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        message.innerHTML = "";
        button.disabled = true;
        button.textContent = "Đang đăng nhập...";

        try {
            // Định dạng payload cần thống nhất với endpoint của thành viên backend.
            const response = await api.post("/auth/login", {
                email: identifier,
                password: password
            });

            const data = response.data || {};
            const token = data.access_token || data.token;
            const user = data.user || data;

            if (!token) {
                throw new Error("API đăng nhập chưa trả về access_token/token.");
            }

            const role = String(user.role || data.role || "").toUpperCase();
            if (role !== "ADMIN") {
                throw new Error("Tài khoản không có quyền quản trị ADMIN.");
            }

            localStorage.setItem("access_token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("full_name", user.full_name || user.name || user.username || identifier);
            if (user.id !== undefined) localStorage.setItem("user_id", String(user.id));

            window.location.href = "dashboard.html";
        } catch (error) {
            message.innerHTML = `<div class="notice notice-error">${escapeHTML(
                error.message && !error.response ? error.message : getErrorMessage(error)
            )}</div>`;
        } finally {
            button.disabled = false;
            button.textContent = "Đăng nhập";
        }
    });
}
