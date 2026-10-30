
renderAdminLayout("artifacts", "Quản lý hiện vật");

const content = document.getElementById("pageContent");

content.innerHTML = `
    <div class="page-heading">
        <div>
            <h1>Quản lý hiện vật</h1>
            <p>Quản lý danh sách, tìm kiếm và theo dõi trạng thái hiện vật.</p>
        </div>

        <a class="btn btn-primary" href="artifact-form.html">
            + Thêm hiện vật
        </a>
    </div>

    <div id="artifactMessage"></div>

    <!-- 4 THẺ KPI -->
    <div class="stats-grid">

        <div class="card stat-card">
            <div class="stat-info">
                <p>Tổng hiện vật</p>
                <h2 id="totalArtifacts">0</h2>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-info">
                <p>Đang hiển thị</p>
                <h2 id="activeArtifacts">0</h2>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-info">
                <p>Đang ẩn</p>
                <h2 id="inactiveArtifacts">0</h2>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-info">
                <p>Số lượng di tích</p>
                <h2 id="totalSites">0</h2>
            </div>
        </div>

    </div>

    <!-- DANH SÁCH HIỆN VẬT -->
    <div class="card">

        <div class="filter-bar">

            <input
                type="text"
                class="form-control"
                id="searchInput"
                placeholder="Tìm theo mã hoặc tên hiện vật..."
            >

            <select class="form-control" id="statusFilter">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hiển thị</option>
                <option value="inactive">Đang ẩn</option>
            </select>

            <button
                class="btn btn-secondary"
                id="refreshButton"
                type="button"
            >
                Làm mới
            </button>

        </div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Mã hiện vật</th>
                        <th>Tên tiếng Việt</th>
                        <th>Tên tiếng Anh</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody id="artifactTableBody">
                    <tr>
                        <td colspan="6" class="loading">
                            Đang tải dữ liệu...
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

    </div>
`;

// ======================================================
// 2. BIẾN DỮ LIỆU
// ======================================================

let allArtifacts = [];

// ======================================================
// 3. CHUẨN HÓA DỮ LIỆU API
// ======================================================

function normalizeArtifacts(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
}

// Lấy giá trị số từ một danh sách tên trường có thể có
function getNumber(data, keys) {
    for (const key of keys) {
        const value = data?.[key];

        if (value !== undefined && value !== null && !isNaN(Number(value))) {
            return Number(value);
        }
    }

    return null;
}

// ======================================================
// 4. KIỂM TRA TRẠNG THÁI HIỆN VẬT
// ======================================================

function isActive(item) {
    if (typeof item.is_active === "boolean") {
        return item.is_active;
    }

    if (item.is_active === 1 || item.is_active === "1") {
        return true;
    }

    if (item.is_active === 0 || item.is_active === "0") {
        return false;
    }

    const status = String(item.status || "").toUpperCase();

    return status === "ACTIVE" ||
           status === "PUBLISHED" ||
           status === "ACTIVE";
}

// ======================================================
// 5. TẢI THỐNG KÊ KPI
// ======================================================

async function loadArtifactStats() {
    try {
        const response = await api.get("/artifacts/stats");

        const stats = response.data?.data || response.data;

        const total = getNumber(stats, [
            "total_artifacts",
            "total",
            "total_count",
            "artifact_count"
        ]);

        const active = getNumber(stats, [
            "active_artifacts",
            "active",
            "active_count",
            "published_count"
        ]);

        const inactive = getNumber(stats, [
            "inactive_artifacts",
            "inactive",
            "inactive_count",
            "hidden_count"
        ]);

        const sites = getNumber(stats, [
            "total_sites",
            "site_count",
            "sites_count"
        ]);

        document.getElementById("totalArtifacts").textContent =
            total ?? allArtifacts.length;

        document.getElementById("activeArtifacts").textContent =
            active ?? allArtifacts.filter(isActive).length;

        document.getElementById("inactiveArtifacts").textContent =
            inactive ?? allArtifacts.filter(item => !isActive(item)).length;

        document.getElementById("totalSites").textContent =
            sites ?? "—";

    } catch (error) {
        console.error("Lỗi tải thống kê hiện vật:", error);

        // Nếu API thống kê chưa hoạt động,
        // vẫn lấy số liệu từ danh sách hiện vật.
        updateStatsFromList();
    }
}

// ======================================================
// 6. CẬP NHẬT KPI TỪ DANH SÁCH
// ======================================================

function updateStatsFromList() {
    const total = allArtifacts.length;
    const active = allArtifacts.filter(isActive).length;
    const inactive = total - active;

    document.getElementById("totalArtifacts").textContent = total;
    document.getElementById("activeArtifacts").textContent = active;
    document.getElementById("inactiveArtifacts").textContent = inactive;
}

// ======================================================
// 7. TẢI DANH SÁCH HIỆN VẬT
// ======================================================

async function loadArtifacts() {
    const tbody = document.getElementById("artifactTableBody");
    const refreshButton = document.getElementById("refreshButton");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Đang tải dữ liệu...
            </td>
        </tr>
    `;

    refreshButton.disabled = true;
    refreshButton.textContent = "Đang tải...";

    try {
        
        const response = await api.get("/artifacts?lang=vi");

        allArtifacts = normalizeArtifacts(response.data);

        renderArtifacts();

        await loadArtifactStats();

    } catch (error) {
        console.error("Lỗi tải danh sách hiện vật:", error);

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    ${escapeHTML(getErrorMessage(error))}
                </td>
            </tr>
        `;

        updateStatsFromList();

    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Làm mới";
    }
}

// ======================================================
// 8. HIỂN THỊ DANH SÁCH HIỆN VẬT
// ======================================================

function renderArtifacts() {
    const query = document
        .getElementById("searchInput")
        .value.trim()
        .toLowerCase();

    const status = document.getElementById("statusFilter").value;

    const filtered = allArtifacts.filter(item => {

        const haystack = [
            item.artifact_code,
            item.name_vi,
            item.name_en
        ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

        const matchesQuery = haystack.includes(query);

        const matchesStatus =
            status === "all" ||
            (status === "active" && isActive(item)) ||
            (status === "inactive" && !isActive(item));

        return matchesQuery && matchesStatus;
    });

    const tbody = document.getElementById("artifactTableBody");

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Không tìm thấy hiện vật phù hợp.
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = filtered.map(item => {

        const id = item.id ?? item.artifact_id;

        const image = getMediaUrl(
            item.image_url || item.image || item.thumbnail
        );

        const active = isActive(item);

        const imageHTML = image
            ? `
                <img
                    class="artifact-image"
                    src="${escapeHTML(image)}"
                    alt="Ảnh hiện vật"
                    onerror="this.style.display='none'"
                >
              `
            : "—";

        return `
            <tr>

                <td>${imageHTML}</td>

                <td>
                    ${escapeHTML(item.artifact_code || "—")}
                </td>

                <td>
                    ${escapeHTML(item.name_vi || "—")}
                </td>

                <td>
                    ${escapeHTML(item.name_en || "—")}
                </td>

                <td>
                    <span class="badge ${
                        active ? "badge-active" : "badge-inactive"
                    }">
                        ${active ? "Đang hiển thị" : "Đang ẩn"}
                    </span>
                </td>

                <td>
                    <div class="action-group">

                        <a
                            class="btn btn-secondary btn-small"
                            href="artifact-form.html?id=${encodeURIComponent(id ?? "")}"
                        >
                            Sửa
                        </a>

                    </div>
                </td>

            </tr>
        `;

    }).join("");
}

// ======================================================
// 9. HIỂN THỊ THÔNG BÁO
// ======================================================

function showArtifactMessage(message, type = "success") {
    const messageElement = document.getElementById("artifactMessage");

    messageElement.innerHTML = `
        <div class="notice notice-${type}">
            ${escapeHTML(message)}
        </div>
    `;
}



document
    .getElementById("searchInput")
    .addEventListener("input", renderArtifacts);

document
    .getElementById("statusFilter")
    .addEventListener("change", renderArtifacts);

document
    .getElementById("refreshButton")
    .addEventListener("click", () => {
        document.getElementById("artifactMessage").innerHTML = "";
        loadArtifacts();
    });


loadArtifacts();
