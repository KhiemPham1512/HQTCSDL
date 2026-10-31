function renderAdminLayout(activePage, pageTitle) {
    const root = document.getElementById("adminRoot");
    if (!root) return;

    const fullName = localStorage.getItem("full_name") || "Quản trị viên";
    const initial = fullName.trim().charAt(0).toUpperCase() || "A";
    const inPages = window.location.pathname.includes("/pages/");
    const menuItems = [
        {page:"dashboard", label:"📊 Dashboard", href: inPages ? "../dashboard.html" : "dashboard.html"},
        {page:"sites", label:"🏛️ Địa điểm di tích", href: inPages ? "sites.html" : "pages/sites.html"},
        {page:"artifacts", label:"🗿 Quản lý hiện vật", href: inPages ? "artifacts.html" : "pages/artifacts.html"}
    ];

    root.innerHTML = `<div class="app-layout">
      <aside class="sidebar">
        <div class="brand">SMART <span>HERITAGE</span></div>
        <div class="sidebar-label">Quản lý hệ thống</div>
        ${menuItems.map(item => `<a class="sidebar-link ${item.page === activePage ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}
        <div class="sidebar-label">Tài khoản</div>
        <a href="#" class="sidebar-link" id="logoutButton">🚪 Đăng xuất</a>
      </aside>
      <main class="main-area">
        <header class="topbar"><div class="topbar-title">${escapeHTML(pageTitle)}</div>
          <div class="user-info"><div class="user-avatar">${escapeHTML(initial)}</div><div>${escapeHTML(fullName)}</div></div>
        </header>
        <section class="page-content" id="pageContent"></section>
      </main>
    </div>`;

    document.getElementById("logoutButton").addEventListener("click", function (event) {
        event.preventDefault();
        logout();
    });
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    })[char]);
}
