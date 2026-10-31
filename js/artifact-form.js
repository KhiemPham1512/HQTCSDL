// =====================================================
// 1. KHỞI TẠO GIAO DIỆN
// =====================================================

renderAdminLayout("artifacts", "Biểu mẫu hiện vật");

const content = document.getElementById("pageContent");

const params = new URLSearchParams(window.location.search);
const artifactId = params.get("id");
const isEditing = Boolean(artifactId);

content.innerHTML = `
    <div class="page-heading">
        <div>
            <h1>${isEditing ? "Chỉnh sửa hiện vật" : "Thêm hiện vật mới"}</h1>
            <p>Nhập thông tin hiện vật bằng tiếng Việt và tiếng Anh.</p>
        </div>
    </div>

    <div id="formMessage"></div>

    <form id="artifactForm" class="card">

        <!-- THÔNG TIN CƠ BẢN -->
        <h3>Thông tin cơ bản</h3>

        <div class="form-grid">

            <div class="form-group">
                <label for="site_id">Địa điểm di tích *</label>
                <select class="form-control" id="site_id" required>
                    <option value="">Đang tải địa điểm...</option>
                </select>
            </div>

            <div class="form-group">
                <label for="artifact_code">Mã hiện vật *</label>
                <input
                    class="form-control"
                    type="text"
                    id="artifact_code"
                    maxlength="100"
                    required
                    placeholder="Ví dụ: HV001"
                >
            </div>

        </div>

        <!-- NGÔN NGỮ -->
        <h3>Thông tin đa ngôn ngữ</h3>

        <div class="tabs">
            <button type="button" class="tab-button active" data-tab="vi">
                Tiếng Việt
            </button>

            <button type="button" class="tab-button" data-tab="en">
                English
            </button>
        </div>

        <div class="tab-panel active" id="panel-vi">

            <div class="form-group">
                <label for="name_vi">Tên hiện vật (Tiếng Việt) *</label>
                <input
                    class="form-control"
                    type="text"
                    id="name_vi"
                    required
                    placeholder="Nhập tên hiện vật"
                >
            </div>

            <div class="form-group">
                <label for="description_vi">Mô tả (Tiếng Việt)</label>
                <textarea
                    class="form-control"
                    id="description_vi"
                    rows="5"
                    placeholder="Nhập nội dung mô tả hiện vật..."
                ></textarea>
            </div>

        </div>

        <div class="tab-panel" id="panel-en">

            <div class="form-group">
                <label for="name_en">Artifact name (English)</label>
                <input
                    class="form-control"
                    type="text"
                    id="name_en"
                    placeholder="Enter artifact name"
                >
            </div>

            <div class="form-group">
                <label for="description_en">Description (English)</label>
                <textarea
                    class="form-control"
                    id="description_en"
                    rows="5"
                    placeholder="Enter artifact description..."
                ></textarea>
            </div>

        </div>

        <!-- HÌNH ẢNH -->
        <h3>Hình ảnh hiện vật</h3>

        <div class="form-group">
            <label for="image_file">Chọn ảnh (JPG, PNG, WebP)</label>

            <input
                class="form-control"
                type="file"
                id="image_file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            >

            <div class="form-hint">
                Dung lượng tối đa 5 MB.
            </div>

            <img
                id="imagePreview"
                class="preview-image hidden"
                alt="Xem trước ảnh hiện vật"
            >
        </div>

        <!-- VIDEO -->
        <h3>Video giới thiệu</h3>

        <div class="form-group">
            <label for="video_url">Đường dẫn video</label>

            <input
                class="form-control"
                type="url"
                id="video_url"
                placeholder="https://..."
            >
        </div>

        <!-- ÂM THANH -->
        <h3>Âm thanh thuyết minh</h3>

        <div class="form-grid">

            <div class="form-group">
                <label for="audio_vi_file">
                    Âm thanh tiếng Việt (MP3)
                </label>

                <input
                    class="form-control"
                    type="file"
                    id="audio_vi_file"
                    accept=".mp3,audio/mpeg"
                >

                <div class="form-hint">
                    Dung lượng tối đa 20 MB.
                </div>

                <audio
                    id="audioViPreview"
                    controls
                    class="hidden"
                    style="width:100%;margin-top:10px"
                ></audio>
            </div>

            <div class="form-group">
                <label for="audio_en_file">
                    Âm thanh tiếng Anh (MP3)
                </label>

                <input
                    class="form-control"
                    type="file"
                    id="audio_en_file"
                    accept=".mp3,audio/mpeg"
                >

                <div class="form-hint">
                    Dung lượng tối đa 20 MB.
                </div>

                <audio
                    id="audioEnPreview"
                    controls
                    class="hidden"
                    style="width:100%;margin-top:10px"
                ></audio>
            </div>

        </div>

        <!-- TỌA ĐỘ -->
        <h3>Vị trí hiện vật trên sơ đồ</h3>

        <div class="form-grid">

            <div class="form-group">
                <label for="map_x">Tọa độ X (0–100)</label>
                <input
                    class="form-control"
                    type="number"
                    id="map_x"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="Ví dụ: 35"
                >
            </div>

            <div class="form-group">
                <label for="map_y">Tọa độ Y (0–100)</label>
                <input
                    class="form-control"
                    type="number"
                    id="map_y"
                    min="0"
                    max="100"
                    step="any"
                    placeholder="Ví dụ: 60"
                >
            </div>

        </div>

        <!-- TRẠNG THÁI -->
        <div class="form-group">
            <label>
                <input type="checkbox" id="is_active" checked>
                Hiển thị hiện vật
            </label>
        </div>

        <!-- NÚT THAO TÁC -->
        <div class="form-actions">

            <button
                class="btn btn-primary"
                id="saveButton"
                type="submit"
            >
                ${isEditing ? "Lưu thay đổi" : "Tạo hiện vật"}
            </button>

            <a
                class="btn btn-secondary"
                href="artifacts.html"
            >
                Quay lại danh sách
            </a>

        </div>

    </form>
`;

// =====================================================
// 2. BIẾN DỮ LIỆU
// =====================================================

let currentArtifact = null;

let imageObjectUrl = null;
let audioViObjectUrl = null;
let audioEnObjectUrl = null;

// =====================================================
// 3. HÀM TIỆN ÍCH
// =====================================================

// Chuẩn hóa dữ liệu trả về từ API
function getResponseData(response) {
    let data = response?.data;

    if (data?.data !== undefined) {
        data = data.data;
    }

    return data;
}

// Chuẩn hóa danh sách
function listFromResponse(data) {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.items)) return data.items;

    if (Array.isArray(data?.results)) return data.results;

    if (Array.isArray(data?.data)) return data.data;

    return [];
}

// Lấy giá trị trường đầu tiên có dữ liệu
function getValue(item, ...keys) {
    for (const key of keys) {
        if (item?.[key] !== undefined && item[key] !== null) {
            return item[key];
        }
    }

    return "";
}

// Gán dữ liệu vào input
function setField(id, value) {
    const element = document.getElementById(id);

    if (element && value !== undefined && value !== null) {
        element.value = value;
    }
}

// Hiển thị thông báo
function showMessage(message, type = "error") {
    document.getElementById("formMessage").innerHTML = `
        <div class="notice notice-${type}">
            ${escapeHTML(message)}
        </div>
    `;
}

// =====================================================
// 4. CHUYỂN TAB NGÔN NGỮ
// =====================================================

document.querySelectorAll("[data-tab]").forEach(button => {

    button.addEventListener("click", () => {

        const selectedTab = button.dataset.tab;

        document.querySelectorAll("[data-tab]").forEach(tab => {
            tab.classList.toggle("active", tab === button);
        });

        document.querySelectorAll(".tab-panel").forEach(panel => {
            panel.classList.toggle(
                "active",
                panel.id === `panel-${selectedTab}`
            );
        });

    });

});

// =====================================================
// 5. TẢI DANH SÁCH DI TÍCH
// =====================================================

async function loadSites() {

    const select = document.getElementById("site_id");

    select.innerHTML = `
        <option value="">Đang tải địa điểm...</option>
    `;

    // API danh sách di tích cần được TV1 xác nhận.
    const response = await api.get("/sites");

    const sites = listFromResponse(getResponseData(response));

    if (!sites.length) {
        select.innerHTML = `
            <option value="">Chưa có địa điểm di tích</option>
        `;

        return;
    }

    select.innerHTML = `
        <option value="">-- Chọn địa điểm --</option>
    `;

    sites.forEach(site => {

        const id = getValue(site, "id", "site_id");

        const name = getValue(
            site,
            "name_vi",
            "site_name_vi",
            "name",
            "title"
        );

        if (id === "") return;

        const option = document.createElement("option");

        option.value = id;
        option.textContent = name || `Địa điểm ${id}`;

        select.appendChild(option);

    });

}

// =====================================================
// 6. HIỂN THỊ ẢNH
// =====================================================

function showImagePreview(url) {

    const image = document.getElementById("imagePreview");

    if (!url) {
        image.removeAttribute("src");
        image.classList.add("hidden");
        return;
    }

    image.src = getMediaUrl(url);
    image.classList.remove("hidden");

}

// =====================================================
// 7. HIỂN THỊ ÂM THANH
// =====================================================

function showAudioPreview(elementId, url) {

    const audio = document.getElementById(elementId);

    if (!url) {
        audio.removeAttribute("src");
        audio.classList.add("hidden");
        return;
    }

    audio.src = getMediaUrl(url);
    audio.classList.remove("hidden");

}

// =====================================================
// 8. TẢI THÔNG TIN HIỆN VẬT KHI CHỈNH SỬA
// =====================================================

async function loadArtifact() {

    if (!isEditing) return;

    const response = await api.get(
        `/artifacts/${encodeURIComponent(artifactId)}`
    );

    currentArtifact = getResponseData(response);

    if (!currentArtifact || typeof currentArtifact !== "object") {
        throw new Error("Không tìm thấy thông tin hiện vật.");
    }

    const item = currentArtifact;

    // Thông tin cơ bản
    setField("site_id", getValue(item, "site_id"));
    setField("artifact_code", getValue(item, "artifact_code"));

    // Tiếng Việt
    setField("name_vi", getValue(item, "name_vi"));
    setField("description_vi", getValue(item, "description_vi"));

    // Tiếng Anh
    setField("name_en", getValue(item, "name_en"));
    setField("description_en", getValue(item, "description_en"));

    // Video
    setField("video_url", getValue(item, "video_url"));

    // Tọa độ
    setField("map_x", getValue(item, "map_x"));
    setField("map_y", getValue(item, "map_y"));

    // Trạng thái
    const activeValue = getValue(item, "is_active", "status");

    document.getElementById("is_active").checked =
        activeValue === "" ||
        activeValue === true ||
        activeValue === 1 ||
        activeValue === "1" ||
        activeValue === "ACTIVE" ||
        activeValue === "active";

    // Ảnh cũ
    showImagePreview(
        getValue(item, "image_url", "image")
    );

    // Âm thanh cũ
    showAudioPreview(
        "audioViPreview",
        getValue(item, "audio_vi_url", "audio_url_vi")
    );

    showAudioPreview(
        "audioEnPreview",
        getValue(item, "audio_en_url", "audio_url_en")
    );

}

// =====================================================
// 9. KIỂM TRA FILE TRƯỚC KHI UPLOAD
// =====================================================

function validateFile(file, type, maxSize, label) {

    if (!file) return;

    if (file.size > maxSize) {
        throw new Error(
            `${label} vượt quá dung lượng cho phép.`
        );
    }

    const extension = file.name.split(".").pop().toLowerCase();

    const valid = type.extensions.includes(extension) &&
        (!file.type || type.mime.includes(file.type));

    if (!valid) {
        throw new Error(
            `Định dạng ${label} không hợp lệ.`
        );
    }

}

// =====================================================
// 10. UPLOAD FILE
// =====================================================

async function uploadFile(file, label) {

    if (!file) return null;

    const formData = new FormData();

    // TV1 cần xác nhận tên trường nhận file.
    // Hiện tại sử dụng tên "file".
    formData.append("file", file);

    // API chính thức theo bảng TV1 cung cấp.
    const response = await api.post(
        "/upload/media",
        formData
    );

    const data = getResponseData(response);

    // API theo tài liệu TV1 trả về đường dẫn url.
    const fileUrl = data?.url ||
                    data?.file_url ||
                    data?.path;

    if (!fileUrl) {
        throw new Error(
            `Upload ${label} thành công nhưng không nhận được đường dẫn file.`
        );
    }

    return fileUrl;

}

// =====================================================
// 11. LẤY GIÁ TRỊ TỌA ĐỘ
// =====================================================

function optionalNumber(id) {

    const value = document.getElementById(id).value.trim();

    if (value === "") return null;

    const number = Number(value);

    if (!Number.isFinite(number)) {
        throw new Error(`Tọa độ ${id} không hợp lệ.`);
    }

    if (number < 0 || number > 100) {
        throw new Error("Tọa độ X và Y phải nằm trong khoảng 0–100.");
    }

    return number;

}

// =====================================================
// 12. XEM TRƯỚC ẢNH ĐƯỢC CHỌN
// =====================================================

document.getElementById("image_file").addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    try {

        validateFile(
            file,
            {
                extensions: ["jpg", "jpeg", "png", "webp"],
                mime: ["image/jpeg", "image/png", "image/webp"]
            },
            5 * 1024 * 1024,
            "ảnh"
        );

        if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);

        imageObjectUrl = URL.createObjectURL(file);

        const image = document.getElementById("imagePreview");

        image.src = imageObjectUrl;
        image.classList.remove("hidden");

    } catch (error) {

        event.target.value = "";
        showMessage(error.message);

    }

});

// =====================================================
// 13. XEM TRƯỚC ÂM THANH TIẾNG VIỆT
// =====================================================

document.getElementById("audio_vi_file").addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    try {

        validateFile(
            file,
            {
                extensions: ["mp3"],
                mime: ["audio/mpeg", "audio/mp3"]
            },
            20 * 1024 * 1024,
            "âm thanh tiếng Việt"
        );

        if (audioViObjectUrl) URL.revokeObjectURL(audioViObjectUrl);

        audioViObjectUrl = URL.createObjectURL(file);

        const audio = document.getElementById("audioViPreview");

        audio.src = audioViObjectUrl;
        audio.classList.remove("hidden");

    } catch (error) {

        event.target.value = "";
        showMessage(error.message);

    }

});

// =====================================================
// 14. XEM TRƯỚC ÂM THANH TIẾNG ANH
// =====================================================

document.getElementById("audio_en_file").addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;

    try {

        validateFile(
            file,
            {
                extensions: ["mp3"],
                mime: ["audio/mpeg", "audio/mp3"]
            },
            20 * 1024 * 1024,
            "âm thanh tiếng Anh"
        );

        if (audioEnObjectUrl) URL.revokeObjectURL(audioEnObjectUrl);

        audioEnObjectUrl = URL.createObjectURL(file);

        const audio = document.getElementById("audioEnPreview");

        audio.src = audioEnObjectUrl;
        audio.classList.remove("hidden");

    } catch (error) {

        event.target.value = "";
        showMessage(error.message);

    }

});

// =====================================================
// 15. TẠO PAYLOAD HIỆN VẬT
// =====================================================

function buildArtifactPayload() {

    const siteId = document.getElementById("site_id").value;

    const artifactCode = document
        .getElementById("artifact_code")
        .value.trim();

    const nameVi = document
        .getElementById("name_vi")
        .value.trim();

    if (!siteId) {
        throw new Error("Vui lòng chọn địa điểm di tích.");
    }

    if (!artifactCode) {
        throw new Error("Vui lòng nhập mã hiện vật.");
    }

    if (!nameVi) {
        throw new Error("Vui lòng nhập tên hiện vật tiếng Việt.");
    }

    return {

        site_id: siteId,

        artifact_code: artifactCode,

        name_vi: nameVi,

        name_en: document
            .getElementById("name_en")
            .value.trim(),

        description_vi: document
            .getElementById("description_vi")
            .value.trim(),

        description_en: document
            .getElementById("description_en")
            .value.trim(),

        video_url: document
            .getElementById("video_url")
            .value.trim() || null,

        map_x: optionalNumber("map_x"),

        map_y: optionalNumber("map_y"),

        is_active: document
            .getElementById("is_active")
            .checked

    };

}

// =====================================================
// 16. GIỮ ĐƯỜNG DẪN FILE CŨ KHI KHÔNG UPLOAD MỚI
// =====================================================

function preserveOldMedia(payload) {

    if (!currentArtifact) return;

    payload.image_url = getValue(
        currentArtifact,
        "image_url",
        "image"
    ) || null;

    payload.audio_vi_url = getValue(
        currentArtifact,
        "audio_vi_url",
        "audio_url_vi"
    ) || null;

    payload.audio_en_url = getValue(
        currentArtifact,
        "audio_en_url",
        "audio_url_en"
    ) || null;

}

// =====================================================
// 17. XỬ LÝ THÊM / CẬP NHẬT HIỆN VẬT
// =====================================================

document.getElementById("artifactForm").addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const button = document.getElementById("saveButton");

        const message = document.getElementById("formMessage");

        message.innerHTML = "";

        button.disabled = true;

        button.textContent = "Đang xử lý...";

        try {

            // Lấy file
            const imageFile =
                document.getElementById("image_file").files[0];

            const audioViFile =
                document.getElementById("audio_vi_file").files[0];

            const audioEnFile =
                document.getElementById("audio_en_file").files[0];

            // Kiểm tra file
            validateFile(
                imageFile,
                {
                    extensions: ["jpg", "jpeg", "png", "webp"],
                    mime: ["image/jpeg", "image/png", "image/webp"]
                },
                5 * 1024 * 1024,
                "ảnh"
            );

            validateFile(
                audioViFile,
                {
                    extensions: ["mp3"],
                    mime: ["audio/mpeg", "audio/mp3"]
                },
                20 * 1024 * 1024,
                "âm thanh tiếng Việt"
            );

            validateFile(
                audioEnFile,
                {
                    extensions: ["mp3"],
                    mime: ["audio/mpeg", "audio/mp3"]
                },
                20 * 1024 * 1024,
                "âm thanh tiếng Anh"
            );

            // Tạo dữ liệu hiện vật
            const payload = buildArtifactPayload();

            // Giữ lại file cũ nếu không chọn file mới
            preserveOldMedia(payload);

            // Upload ảnh mới
            if (imageFile) {

                button.textContent = "Đang tải ảnh...";

                payload.image_url = await uploadFile(
                    imageFile,
                    "ảnh"
                );

            }

            // Upload âm thanh tiếng Việt
            if (audioViFile) {

                button.textContent = "Đang tải âm thanh tiếng Việt...";

                payload.audio_vi_url = await uploadFile(
                    audioViFile,
                    "âm thanh tiếng Việt"
                );

            }

            // Upload âm thanh tiếng Anh
            if (audioEnFile) {

                button.textContent = "Đang tải âm thanh tiếng Anh...";

                payload.audio_en_url = await uploadFile(
                    audioEnFile,
                    "âm thanh tiếng Anh"
                );

            }

            // Lưu hiện vật
            button.textContent = "Đang lưu hiện vật...";

            if (isEditing) {

                await api.put(
                    `/artifacts/${encodeURIComponent(artifactId)}`,
                    payload
                );

            } else {

                await api.post(
                    "/artifacts",
                    payload
                );

            }

            showMessage(
                isEditing
                    ? "Cập nhật hiện vật thành công!"
                    : "Thêm hiện vật thành công!",
                "success"
            );

            button.textContent = "Đã lưu thành công";

            // Quay về danh sách
            setTimeout(() => {
                window.location.href = "artifacts.html";
            }, 1000);

        } catch (error) {

            console.error("Lỗi lưu hiện vật:", error);

            const errorMessage = error.response
                ? getErrorMessage(error)
                : error.message || "Có lỗi xảy ra khi lưu hiện vật.";

            showMessage(errorMessage, "error");

            button.disabled = false;

            button.textContent = isEditing
                ? "Lưu thay đổi"
                : "Tạo hiện vật";

        }

    }
);

// =====================================================
// 18. KHỞI TẠO FORM
// =====================================================

async function initForm() {

    const button = document.getElementById("saveButton");

    button.disabled = true;

    try {

        // Tải địa điểm trước
        await loadSites();

        // Nếu là chỉnh sửa, tải thông tin hiện vật
        if (isEditing) {
            await loadArtifact();
        }

    } catch (error) {

        console.error("Lỗi khởi tạo biểu mẫu:", error);

        showMessage(
            getErrorMessage(error),
            "error"
        );

    } finally {

        button.disabled = false;

    }

}

initForm();



window.addEventListener("beforeunload", () => {

    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);

    if (audioViObjectUrl) URL.revokeObjectURL(audioViObjectUrl);

    if (audioEnObjectUrl) URL.revokeObjectURL(audioEnObjectUrl);

});
