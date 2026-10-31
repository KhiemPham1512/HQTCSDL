// Chỉ bảo vệ điều hướng giao diện. Backend vẫn phải xác thực token và role ADMIN.
(function () {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
        const inPages = window.location.pathname.includes("/pages/");
        window.location.replace(inPages ? "../login.html" : "login.html");
    }
})();
