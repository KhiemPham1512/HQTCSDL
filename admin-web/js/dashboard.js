renderAdminLayout("dashboard", "Tổng quan hệ thống");
const content = document.getElementById("pageContent");
content.innerHTML = `
  <div class="page-heading"><div><h1>Dashboard</h1><p>Tổng quan hệ thống Smart Heritage.</p></div></div>
  <div id="dashboardMessage"></div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-label">Tổng số hiện vật</div><div class="stat-value" id="artifactCount">—</div></div>
    <div class="stat-card"><div class="stat-label">Hiện vật đang hiển thị</div><div class="stat-value" id="activeCount">—</div></div>
    <div class="stat-card"><div class="stat-label">Địa điểm di tích</div><div class="stat-value" id="siteCount">—</div></div>
  </div>
  <div class="card"><h2 class="card-title">Bắt đầu quản lý</h2>
    <p>Thêm hiện vật, cập nhật nội dung tiếng Việt/tiếng Anh, tải ảnh và âm thanh thuyết minh.</p>
    <a class="btn btn-primary" href="pages/artifact-form.html">+ Thêm hiện vật</a>
    <a class="btn btn-secondary" href="pages/artifacts.html">Xem danh sách hiện vật</a>
  </div>`;

function normalizeList(data) {
    if (Array.isArray(data)) return data;
    return data?.items || data?.results || data?.data || [];
}

async function loadDashboard() {
    try {
        const [artifactsResponse, sitesResponse] = await Promise.all([
            api.get("/artifacts"),
            api.get("/sites")
        ]);
        const artifacts = normalizeList(artifactsResponse.data);
        const sites = normalizeList(sitesResponse.data);
        document.getElementById("artifactCount").textContent = artifacts.length;
        document.getElementById("activeCount").textContent = artifacts.filter(item =>
            item.is_active === true || item.is_active === 1 || item.status === "ACTIVE"
        ).length;
        document.getElementById("siteCount").textContent = sites.length;
    } catch (error) {
        document.getElementById("dashboardMessage").innerHTML =
            `<div class="notice notice-info">${escapeHTML(getErrorMessage(error))} Các thẻ số liệu sẽ hiển thị sau khi backend sẵn sàng.</div>`;
    }
}
loadDashboard();
