renderAdminLayout("sites", "Địa điểm di tích");
const content = document.getElementById("pageContent");
content.innerHTML = `
  <div class="page-heading"><div><h1>Địa điểm di tích</h1><p>Danh sách địa điểm được cung cấp từ backend.</p></div></div>
  <div id="siteMessage"></div>
  <div class="card"><div class="table-wrapper"><table>
    <thead><tr><th>ID</th><th>Tên địa điểm</th><th>Mô tả</th><th>Địa chỉ</th></tr></thead>
    <tbody id="siteTableBody"><tr><td colspan="4" class="loading">Đang tải dữ liệu...</td></tr></tbody>
  </table></div></div>`;

function listFromResponse(data) {
    if (Array.isArray(data)) return data;
    return data?.items || data?.results || data?.data || [];
}

async function loadSites() {
    const tbody = document.getElementById("siteTableBody");
    try {
        const response = await api.get("/sites");
        const sites = listFromResponse(response.data);
        if (!sites.length) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Chưa có địa điểm di tích.</td></tr>`;
            return;
        }
        tbody.innerHTML = sites.map(site => `<tr>
          <td>${escapeHTML(site.id ?? site.site_id ?? "")}</td>
          <td>${escapeHTML(site.name_vi ?? site.name ?? "")}</td>
          <td>${escapeHTML(site.description_vi ?? site.description ?? "")}</td>
          <td>${escapeHTML(site.address ?? "")}</td>
        </tr>`).join("");
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-state">${escapeHTML(getErrorMessage(error))}</td></tr>`;
    }
}
loadSites();
