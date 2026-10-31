// Sửa URL này theo địa chỉ backend FastAPI của nhóm.
const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000
});

api.interceptors.request.use(function (config) {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
            localStorage.removeItem("full_name");
            localStorage.removeItem("user_id");
        }
        return Promise.reject(error);
    }
);

function getMediaUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
    const origin = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${origin}/${String(path).replace(/^\/+/, "")}`;
}

function getErrorMessage(error) {
    const data = error?.response?.data;
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) return data.detail.map(item => item.msg).join(", ");
    if (typeof data?.message === "string") return data.message;
    if (error?.message === "Network Error") {
        return "Không kết nối được backend. Hãy kiểm tra FastAPI, URL API và cấu hình CORS.";
    }
    return "Đã xảy ra lỗi. Vui lòng thử lại.";
}


// Hàm dùng chung để hiển thị nội dung an toàn trong HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
}
