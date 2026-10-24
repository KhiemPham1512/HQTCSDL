# 🏛️ Smart Heritage

> Hệ thống du lịch thông minh ứng dụng công nghệ **iBeacon (Bluetooth Low Energy)** giúp tự động nhận diện khoảng cách của khách tham quan với hiện vật lịch sử, phát thuyết minh đa ngôn ngữ và hỗ trợ ban quản lý số hóa, thống kê dữ liệu di tích.

![Platform](https://img.shields.io/badge/mobile-Android%20(Kotlin%20%2B%20Compose)-3DDC84)
![Backend](https://img.shields.io/badge/backend-FastAPI%20(Python%203.12)-009688)
![Database](https://img.shields.io/badge/database-SQL%20Server%202022-CC2927)
![Admin](https://img.shields.io/badge/admin-React%20%2B%20TypeScript-61DAFB)

---

## 1. Vấn đề và hướng giải quyết

Tại nhiều bảo tàng và khu di tích lịch sử ở Việt Nam, việc tiếp cận thông tin hiện vật vẫn còn nhiều rào cản:

| Vấn đề | Hậu quả |
|---|---|
| Bảng thông tin tĩnh và chỉ có tiếng Việt | Khách tham quan (đặc biệt là khách quốc tế và giới trẻ) tiếp nhận thụ động, khó hiểu sâu câu chuyện lịch sử |
| Quét mã QR thủ công ở từng hiện vật | Làm đứt mạch cảm xúc tham quan, bất tiện khi thiếu sáng hoặc đông người |
| Ban quản lý thiếu công cụ số hóa và đo lường | Không biết hiện vật nào được quan tâm nhất, khách dùng ngôn ngữ nào hay thời gian dừng chân bao lâu |

**Smart Heritage loại bỏ thao tác quét mã thủ công.** Thay vào đó, luồng trải nghiệm tự động của hệ thống là:

```text
Approach  →  Detect (BLE)  →  Resolve  →  Experience  →  Cache  →  Analyze
Tiếp cận     Bắt sóng iBeacon   Tra cứu     Nghe/Xem       Lưu tạm   Thống kê
hiện vật     dưới 2.0 mét       đa ngữ      thuyết minh    xem tiếp  lượt tương tác
```

### Luồng tự động nhận diện iBeacon và thuyết minh (điểm đặc trưng)

```mermaid
flowchart TD
    A[Thiết bị iBeacon đặt cạnh hiện vật<br/>phát sóng BLE: UUID, Major, Minor] --> B[Khách tham quan cầm điện thoại<br/>bước vào bán kính <= 2.0m]
    B --> C{Kiểm tra chống lặp<br/>Cooldown 5-10 phút?}
    C -- Đã bật gần đây --> D[Bỏ qua thông báo lặp<br/>tránh làm phiền khách]
    C -- Hiện vật mới --> E[Gọi FastAPI kèm mã Major/Minor<br/>và ngôn ngữ đã chọn VI/EN]
    E --> F[📱 Trượt Popup hiện vật<br/>& Phát Audio Guide thuyết minh]
    F --> G[Lưu tạm vào bộ nhớ máy<br/>Room Database]
    G --> H{Khách di chuyển<br/>ra khỏi vùng sóng?}
    H -- Có --> I[🎧 Vẫn tiếp tục nghe/đọc<br/>không bị ngắt quãng]
    H -- Xem xong --> J[📊 Gửi log thời gian tương tác<br/>về Dashboard quản trị]
```

> Hệ thống **tự động chống lặp thông báo (Duplicate Prevention)**: Khi khách đứng yên ngắm một hiện vật, ứng dụng chỉ bật gợi ý một lần duy nhất và chỉ kích hoạt lại khi khách bước sang vùng phủ sóng của hiện vật khác.

---

## 2. Tính năng (phạm vi MVP trong 1 tháng)

| Nhóm | Chức năng |
|---|---|
| 👤 Tài khoản & Đa ngữ | Đăng ký / đăng nhập bằng email + password, chế độ **Khách vãng lai (Guest)** không cần đăng nhập, cập nhật hồ sơ, chọn ngôn ngữ thuyết minh (**Tiếng Việt / Tiếng Anh**), phân quyền `ADMIN` / `CONTENT_MANAGER` / `VISITOR` |
| 📡 Nhận diện iBeacon | Quét tín hiệu Bluetooth Low Energy (BLE) liên tục, ước lượng khoảng cách từ chỉ số RSSI, tự động bật **Bottom Sheet Popup** trong vòng $< 2\text{ s}$ khi cách hiện vật $\le 2.0\text{ m}$, chặn thông báo trùng lặp |
| 🎧 Đa phương tiện & Offline | Xem mô tả ngắn (`summary`), câu chuyện lịch sử chi tiết (`description`), bộ sưu tập ảnh, video và trình phát **Audio Guide (`.mp3`)** theo ngôn ngữ đã chọn; tự động lưu đệm (Cache) để khách rời khỏi vùng sóng iBeacon vẫn nghe/đọc tiếp trọn vẹn |
| 🗺️ Bản đồ di tích | Hiển thị sơ đồ mặt bằng khu di tích với các điểm ghim (Pin) vị trí hiện vật; làm nổi bật vị trí hiện vật khách đang đứng gần; chạm vào ghim để xem thông tin |
| ❤️ Yêu thích & Lịch sử | Lưu hiện vật yêu thích (Favorites), xem lại nhật ký các hiện vật đã đi qua (Visit History) hỗ trợ cả tài khoản đăng nhập và chế độ Guest |
| ⭐ Đánh giá & Phản hồi | Chấm điểm $1\text{--}5$ sao và gửi nhận xét cho từng hiện vật; Admin kiểm duyệt (hiển thị / ẩn) phản hồi trên Web |
| 🛠️ Quản trị CMS & iBeacon | Quản lý khu di tích, thêm/sửa/xóa hiện vật đa ngôn ngữ (`HV-001`...), tải lên file ảnh/MP3; đăng ký mã iBeacon (`BC-001`..., `UUID`, `Major`, `Minor`), gán iBeacon vào hiện vật và chấm tọa độ $(X, Y)$ lên sơ đồ |
| 📊 Thống kê & Báo cáo | Dashboard trực quan hóa tổng lượt khách, biểu đồ Top 10 hiện vật phổ biến, lượt tương tác theo ngày, tỷ lệ ngôn ngữ sử dụng và xuất báo cáo **Excel/CSV (`.csv`)** |

---

## 3. Kiến trúc tổng quan và cách các công nghệ kết nối

```mermaid
flowchart LR
    subgraph Hardware["📡 Hạ tầng tại Di tích"]
        BLE["Thiết bị iBeacon /<br/>App Beacon Simulator"]
    end

    subgraph Clients["📱 Giao diện Người dùng"]
        APP["📱 Android App<br/>Kotlin + Jetpack Compose<br/>+ Room Cache"]
        WEB["🖥️ Admin Web Portal<br/>React + TypeScript<br/>+ Chart.js"]
    end

    subgraph Backend["⚙️ Server Trung tâm"]
        API["🐍 FastAPI (Python 3.12)<br/>RESTful API + JWT Auth<br/>+ Media Static Server"]
    end

    subgraph DataLayer["🗄️ Lưu trữ Dữ liệu"]
        DB[("🗄️ SQL Server<br/>SmartHeritageDB")]
        FILES["🖼️ Thư mục Static Media<br/>(Ảnh, Audio MP3, Sơ đồ)"]
    end

    BLE -. "1. Phát sóng Bluetooth 2.4GHz<br/>(UUID, Major, Minor, RSSI)" .-> APP
    APP -- "2. Gửi Major/Minor + Lang<br/>(HTTP REST JSON)" --> API
    APP -- "3. Stream trực tiếp MP3 / Ảnh" --> FILES
    APP -- "4. Gửi Log tương tác & Đánh giá" --> API

    WEB -- "5. Quản lý Hiện vật, Gán Beacon<br/>& Xem Thống kê (REST + JWT)" --> API
    API -- "6. Truy vấn SQLAlchemy / pyodbc" --> DB
    API -- "7. Lưu / Đọc file đa phương tiện" --> FILES
```

### Quy tắc kết nối giữa các thành phần (dễ nhớ)

> **iBeacon chỉ phát mã số qua Bluetooth $\rightarrow$ App Android bắt mã số đó hỏi FastAPI $\rightarrow$ FastAPI tra bảng SQL Server trả về nội dung và link thuyết minh MP3.**

| Việc cần làm | Đi đường nào | Vì sao |
|---|---|---|
| Phát tín hiệu vị trí hiện vật | `iBeacon` $\rightarrow$ `Android App` (qua sóng Bluetooth BLE) | Cục iBeacon chỉ phát quảng bá 1 chiều (`UUID`, `Major`, `Minor`), không cần mạng Internet |
| Biết cục iBeacon đó là hiện vật gì | `Android App` $\rightarrow$ `FastAPI` (`GET /api/beacons/resolve`) | App gửi `Major`, `Minor` và ngôn ngữ (`vi`/`en`) lên Server để lấy đúng bài viết, ảnh và link MP3 |
| Nghe thuyết minh & xem ảnh | `Android App` $\rightarrow$ `FastAPI Static Media` (`/static/...`) | Tải ảnh và phát trực tiếp (stream) file `.mp3` qua trình phát `ExoPlayer` |
| Xem tiếp khi đã đi xa hiện vật | `Android App` $\rightarrow$ `Room Database` (Bộ nhớ trong điện thoại) | Nội dung vừa mở được lưu tạm trên máy, mất sóng Bluetooth vẫn nghe tiếp đến hết bài |
| Ghi nhận lượt khách & thời gian xem | `Android App` $\rightarrow$ `FastAPI` (`POST /api/visit-logs`) | Khi khách rời hiện vật, App gửi số giây đã xem lên Server để cộng vào biểu đồ thống kê |
| Thêm hiện vật, tải MP3 & gán Beacon | `Admin Web` $\rightarrow$ `FastAPI` $\rightarrow$ `SQL Server` | Giúp ban quản lý cập nhật nội dung mới từ trình duyệt mà không cần sửa code ứng dụng di động |
| Xem biểu đồ & xuất báo cáo Excel/PDF | `Admin Web` $\rightarrow$ `FastAPI` (`GET /api/analytics/dashboard`) | Server tổng hợp dữ liệu bằng các câu lệnh `GROUP BY` từ SQL Server trả về cho Web vẽ biểu đồ |

---

## 4. Công nghệ sử dụng & Phiên bản cần thiết

> ⚠️ **Lưu ý quan trọng cho các thành viên trong nhóm:** Để đảm bảo cài đặt thư viện thành công 100% trên mọi máy tính, các thành viên cần cài đặt đúng phiên bản phần mềm trong bảng dưới đây.

### 🛠️ Phần mềm nền tảng và Phiên bản bắt buộc

| Phần mềm / Công cụ | Phiên bản cần thiết | Thành viên cần cài | Lưu ý khi cài đặt |
|---|---|---|---|
| **Python** | **Python 3.12.x (64-bit)** *(Khuyên dùng `3.12.10`)* | TV1, TV3, TV4, TV5 | **Không dùng Python 3.14 hoặc 3.15** (vì chưa có sẵn gói wheel `.whl` cho `pyodbc` và `pydantic-core` trên Windows). Khi cài nhớ tích chọn **"Add python.exe to PATH"**. |
| **SQL Server & SSMS** | **SQL Server 2019 / 2022** (Developer hoặc Express) + **SSMS 19/20** | TV1, TV3, TV4, TV5 | Đi kèm sẵn `ODBC Driver 17/18 for SQL Server` để kết nối với Backend. |
| **Node.js** | **Node.js 20.x LTS** (hoặc `18.x LTS`) | TV3, TV4 (Web Admin) | Dùng để chạy cổng quản trị React + Vite. |
| **Android Studio** | **Android Studio Koala / Ladybug (2024.x+)** + **JDK 17** | TV2, TV1 (Mobile) | Cần 1 điện thoại Android thật để quét Bluetooth và 1 điện thoại phụ cài app **Beacon Simulator**. |
| **Git & VS Code** | Bản mới nhất | Cả 5 thành viên | Quản lý nhánh theo mô hình `main` - `develop` - `feature/*`. |

### ⚙️ Backend (Python - Đã cấu hình trong `backend/requirements.txt`)

| Mục đích | Công nghệ & Phiên bản |
|---|---|
| Framework RESTful API | `fastapi==0.115.0` + `uvicorn[standard]==0.30.6` (Tự động sinh Swagger UI tại `/docs`) |
| Kết nối Cơ sở dữ liệu | `sqlalchemy==2.0.35` + `pyodbc==5.1.0` |
| Kiểm tra dữ liệu & Biến môi trường | `pydantic==2.9.2` + `python-dotenv==1.0.1` |
| Xác thực & Phân quyền | `HTTPBearer JWT (HS256)` + `SHA-256 Password Hashing` + `RBAC` (`app/auth.py`) |
| Upload & Phục vụ file Ảnh / MP3 | `python-multipart==0.0.12` + `FastAPI StaticFiles` |
| Xuất báo cáo thống kê | `StreamingResponse CSV (UTF-8-SIG BOM)` tương thích trực tiếp với Microsoft Excel |

### 📱 Mobile (Android - Định hướng tích hợp)

| Mục đích | Công nghệ |
|---|---|
| Ngôn ngữ / Giao diện | Kotlin, Jetpack Compose, Material 3 (Min SDK: `26`, Target SDK: `34`) |
| Kiến trúc | MVVM (`UI` $\rightarrow$ `ViewModel` $\rightarrow$ `Repository`), Kotlin Coroutines + StateFlow |
| Quét sóng iBeacon (BLE) | `Android Beacon Library (AltBeacon 2.20+)` |
| Giả lập thiết bị phát iBeacon | Ứng dụng `Beacon Simulator` trên điện thoại Android phụ |
| Phát thuyết minh Audio / Video | `AndroidX Media3 (ExoPlayer)` |
| Lưu đệm xem ngoài vùng sóng | `Room Database (SQLite)` + `DataStore` |
| Gọi REST API & Hiển thị ảnh | `Retrofit2` + `OkHttp3` + `Coil` |
### 🗄️ Cơ sở dữ liệu

| Mục đích | Công nghệ & Phiên bản |
|---|---|
| Hệ quản trị CSDL | `Microsoft SQL Server 2019 / 2022` (Database: `SmartHeritageDB`) |
| Công cụ quản trị & Thiết kế | `SQL Server Management Studio (SSMS 19/20)` |
| Driver kết nối từ Backend | `ODBC Driver 17 for SQL Server` hoặc `ODBC Driver 18 for SQL Server` |

### 🖥️ Admin Web (Định hướng tích hợp)

| Mục đích | Công nghệ |
|---|---|
| Framework | `React 18` + `Vite` + `TypeScript` |
| Thư viện giao diện CMS | `Ant Design` / `Tailwind CSS` |
| Biểu đồ thống kê Dashboard | `Chart.js` / `Recharts` |
| Gọi API | `Axios` |

---

## 5. Thiết kế cơ sở dữ liệu

Schema gồm **6 bảng cốt lõi** trong SQL Server (`SmartHeritageDB`), đồng bộ 100% với thiết kế Figma Web (`W1`–`W8`) và Mobile (`1`–`10`).

```mermaid
erDiagram
    SITES ||--o{ ARTIFACTS : "chứa"
    ARTIFACTS ||--o| BEACONS : "được gắn"
    USERS ||--o{ VISIT_LOGS : "tạo lịch sử"
    ARTIFACTS ||--o{ VISIT_LOGS : "được xem"
    BEACONS ||--o{ VISIT_LOGS : "kích hoạt"
    USERS ||--o{ FEEDBACKS : "đánh giá"
    ARTIFACTS ||--o{ FEEDBACKS : "nhận đánh giá"

    USERS {
        int user_id PK
        varchar email UK
        varchar password_hash
        nvarchar full_name
        varchar role "ADMIN | CONTENT_MANAGER | VISITOR"
        varchar preferred_lang "vi | en | ko | ja | zh"
        bit auto_beacon_notify
        bit is_active
    }
    SITES {
        int site_id PK
        nvarchar name_vi
        nvarchar name_en
        nvarchar floor_name
        varchar map_image_url
    }
    ARTIFACTS {
        int artifact_id PK
        int site_id FK
        varchar artifact_code UK "HV-001.."
        nvarchar zone_name
        nvarchar name_vi
        nvarchar name_en
        nvarchar summary_vi
        nvarchar summary_en
        nvarchar description_vi
        nvarchar description_en
        varchar image_url
        varchar audio_vi_url
        varchar audio_en_url
        int audio_duration_sec
        float map_x
        float map_y
        varchar status "PUBLISHED | DRAFT | HIDDEN"
    }
    BEACONS {
        int beacon_id PK
        varchar beacon_code UK "BC-001.."
        int artifact_id FK
        varchar uuid
        int major
        int minor
        float trigger_distance
        int battery_level
        datetime2 last_seen_at
        varchar status "ACTIVE | LOW_BATTERY | LOST_SIGNAL"
    }
    VISIT_LOGS {
        int log_id PK
        int user_id FK
        varchar device_id
        int artifact_id FK
        int beacon_id FK
        varchar lang_used
        int duration_seconds
        bit is_favorite
        datetime2 visited_at
    }
    FEEDBACKS {
        int feedback_id PK
        int user_id FK
        nvarchar visitor_name
        int artifact_id FK
        tinyint rating "1..5"
        nvarchar comment
        bit is_visible
        datetime2 created_at
    }
```

### Trạng thái nhận diện iBeacon trên thiết bị di động

```mermaid
stateDiagram-v2
    direction LR
    [*] --> SCANNING: Bật Bluetooth
    SCANNING --> DETECTED: Khoảng cách <= 2.0m
    DETECTED --> POPUP_SHOWN: Chưa trong thời gian Cooldown
    POPUP_SHOWN --> PLAYING_MEDIA: Khách bấm xem / nghe thuyết minh
    PLAYING_MEDIA --> CACHED_OUT_OF_RANGE: Khách bước ra xa > 4.0m
    CACHED_OUT_OF_RANGE --> LOG_SYNCED: Nghe xong & Gửi thống kê về Server
    POPUP_SHOWN --> COOLDOWN_LOCKED: Khoá lặp lại (5-10 phút)
    COOLDOWN_LOCKED --> DETECTED: Bước sang iBeacon của hiện vật khác
```

---

## 6. Cơ chế kỹ thuật & Bảo mật: những điểm chính

- **Lọc nhiễu tín hiệu BLE & Chống lặp thông báo:** Sóng Bluetooth rất dễ dao động; ứng dụng kết hợp kiểm tra ngưỡng khoảng cách kích hoạt (`trigger_distance` $\le 2.0\text{ m}$) và biến khóa thời gian (`Cooldown Timer`) để không bao giờ bật thông báo lặp lại làm phiền khách khi họ vẫn đứng tại cùng một hiện vật.
- **Xem liên tục ngoài vùng phủ sóng:** Ngay khi hiện vật được kích hoạt, nội dung văn bản và đường dẫn âm thanh được lưu vào `Room Database` trên điện thoại, giúp khách vừa đi dạo sang khu vực khác vừa nghe hết bài thuyết minh.
- **Tự động chuyển đổi đa ngôn ngữ:** Dựa trên cờ ngôn ngữ (`preferred_lang` = `vi` hoặc `en`) của khách, API tự động trả về tiêu đề, mô tả ngắn (`summary`), câu chuyện lịch sử (`description`) và file âm thanh `.mp3` tương ứng.
- **Giám sát tình trạng iBeacon thụ động (Passive Telemetry):** Mỗi khi điện thoại của khách tham quan quét thấy iBeacon và gọi API `/api/beacons/resolve`, hệ thống tự động cập nhật cột `last_seen_at` của thiết bị đó.
- **Bảo mật & Phân quyền (RBAC):** Xác thực người dùng bằng `HTTPBearer` JWT Token (`HS256`) và phân quyền 3 cấp độ: `ADMIN`, `CONTENT_MANAGER`, `VISITOR`.

---

## 7. Giao diện (thiết kế Figma)

Thiết kế gồm **10 màn hình Mobile (`1`–`10`)** và **8 màn hình Web Admin (`W1`–`W8`)**:

| Nhóm màn hình | Nội dung |
|---|---|
| **Mobile: Khởi động & Tài khoản (`1`–`3`)** | `1.` Chào mừng và chọn ngôn ngữ, `2.` Đăng nhập (hoặc *Tiếp tục với tư cách Khách*), `3.` Tạo tài khoản |
| **Mobile: Trang chủ & Rada BLE (`4`–`5`)** | `4.` Trang chủ và Rada dò iBeacon, `5.` Popup tự động trượt lên khi tới gần hiện vật |
| **Mobile: Trải nghiệm Hiện vật (`6`, `8`)** | `6.` Chi tiết hiện vật và Trình phát Audio Guide MP3, `8.` Hộp thoại Chia sẻ cảm nhận (chấm 1–5 sao) |
| **Mobile: Bản đồ & Cá nhân (`7`, `9`, `10`)** | `7.` Bản đồ tương tác sơ đồ di tích, `9.` Yêu thích và Lịch sử tham quan, `10.` Hồ sơ cá nhân & công tắc thông báo iBeacon |
| **Admin Web: Quản trị CMS (`W1`, `W3`, `W4`)** | `W1.` Đăng nhập quản trị, `W3.` Quản lý hiện vật, `W4.` Thêm/sửa hiện vật & đa ngôn ngữ (tải file Ảnh + MP3) |
| **Admin Web: Hạ tầng iBeacon (`W5`, `W6`)** | `W5.` Quản lý thiết bị iBeacon (`BC-001`...), `W6.` Bản đồ vị trí iBeacon & khu di tích |
| **Admin Web: Thống kê & Phản hồi (`W2`, `W7`, `W8`)** | `W2.` Thống kê & xuất báo cáo, `W7.` Kiểm duyệt đánh giá & phản hồi, `W8.` Quản lý ngôn ngữ & tài khoản |

---

## 8. Cấu trúc repository (Cập nhật theo tiến độ thực tế: M0 $\rightarrow$ M7 Backend)

> 📌 Cấu trúc dưới đây phản ánh **chính xác 100% các thư mục và file đã được triển khai thực tế** trong repository tính đến hiện tại:

```text
SmartHeritage/
├── backend/                         # Server Python FastAPI
│   ├── app/
│   │   ├── routers/
│   │   │   ├── auth_router.py       # [M1] API Đăng nhập, Đăng ký, Guest, Hồ sơ & Quản lý Users (W1, W8, Mobile 1,2,3,10)
│   │   │   ├── artifact_router.py   # [M2] API Quản lý Hiện vật, Thống kê thẻ W3 & Upload Ảnh/MP3 (W3, W4, Mobile 4,6,7)
│   │   │   ├── beacon_router.py     # [M3] API Quản lý iBeacon, Thống kê thẻ W5 & Sơ đồ tọa độ di tích (W5, W6, Mobile 7)
│   │   │   └── analytics_router.py  # [M6-M7] API Lịch sử, Yêu thích, Đánh giá, Kiểm duyệt W7 & Dashboard Thống kê/CSV W2
│   │   ├── auth.py                  # [M1] Xử lý băm mật khẩu & tạo/kiểm tra HTTPBearer JWT Token
│   │   ├── database.py              # [M0] Tự động dò ODBC Driver & kết nối SQL Server
│   │   ├── main.py                  # [M0-M7] Khởi tạo FastAPI, CORS, Static Media, Health-DB, Resolve iBeacon & Gắn kết 4 Routers
│   │   └── schemas.py               # [M1-M7] Khuôn mẫu dữ liệu Pydantic cho toàn bộ các phân hệ
│   ├── static/
│   │   ├── audio/                   # [M0] Thư mục lưu trữ file thuyết minh âm thanh (.mp3, .wav)
│   │   └── images/                  # [M0] Thư mục lưu trữ hình ảnh hiện vật & sơ đồ mặt bằng (.jpg, .png)
│   ├── .env.example                 # [M0] File mẫu cấu hình kết nối SQL Server cho các thành viên
│   └── requirements.txt             # [M0] Danh sách thư viện Python chuẩn của Backend
├── database/
│   └── init_schema.sql              # [M0] Script khởi tạo CSDL SmartHeritageDB (6 bảng + Dữ liệu mẫu HV-001..005, BC-001..005)
├── .gitignore                       # [M0] Chặn .venv, __pycache__, .env, node_modules, build
└── README.md                        # Tài liệu tổng quan và hướng dẫn cài đặt dự án
```

---

## 9. Hướng dẫn cài đặt và chạy dự án (Chuẩn hóa cho mọi máy trong nhóm)

Bất kỳ thành viên nào sau khi `git clone` dự án về máy chỉ cần thực hiện đúng **3 bước** dưới đây:

### Bước 1: Khởi tạo Cơ sở dữ liệu trên SQL Server (SSMS)
1. Mở **SQL Server Management Studio (SSMS)** và kết nối vào Server của máy bạn.
   * *Ghi nhớ tên **Server name** ở màn hình đăng nhập SSMS (ví dụ: `.\SQLEXPRESS`, `localhost`, hoặc `TEN_MAY\SQLEXPRESS`).*
2. Chọn **File $\rightarrow$ Open $\rightarrow$ File...**, mở file **`database/init_schema.sql`** trong thư mục dự án.
3. Nhấn **`F5` (Execute)** để tạo CSDL `SmartHeritageDB` gồm 6 bảng và dữ liệu mẫu đồng bộ với Figma.

### Bước 2: Thiết lập Môi trường ảo Python 3.12 & Cài đặt thư viện
> **Yêu cầu:** Máy đã cài đặt **Python 3.12 (64-bit)** từ [python.org/downloads/windows](https://www.python.org/downloads/windows/) (có tích chọn *"Add python.exe to PATH"*).

Mở Terminal trong VS Code và chạy lần lượt các lệnh:

```powershell
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Tạo môi trường ảo chuẩn Windows bằng Python 3.12
py -3.12 -m venv .venv

# 3. Cấp quyền chạy script trên PowerShell (nếu dùng CMD thì bỏ qua dòng này)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# 4. Kích hoạt môi trường ảo (Nếu dùng CMD thì gõ: .venv\Scripts\activate)
.\.venv\Scripts\Activate.ps1

# 5. Cài đặt các thư viện trong requirements.txt
pip install -r requirements.txt
```
*(Khi cần thoát khỏi môi trường ảo, chỉ cần gõ lệnh `deactivate`).*

### Bước 3: Cấu hình file `.env` và Khởi chạy FastAPI Server
1. Trong thư mục `backend/`, copy file `.env.example` thành file **`.env`** và điền đúng tên `DB_SERVER` trên máy của bạn:
   ```env
   USE_WINDOWS_AUTH=true
   DB_SERVER=.\SQLEXPRESS
   DB_NAME=SmartHeritageDB
   ```
2. Khởi chạy Server FastAPI (đảm bảo đầu dòng lệnh đang có tiền tố `(.venv)`):
   ```powershell
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. Mở trình duyệt kiểm tra:
   * **`http://localhost:8000/docs`**: Giao diện Swagger UI để chạy thử toàn bộ 25+ RESTful API của dự án.
   * **`http://localhost:8000/api/health-db`**: Trả về `"status": "CONNECTED"` và `"total_artifacts": 5`.
   * **`http://localhost:8000/api/analytics/dashboard`**: Trả về toàn bộ số liệu thống kê cho trang Dashboard W2.

---

## 10. Lộ trình (Hoàn thành trong 1 tháng - 30 ngày)

- [x] **M0** Nền tảng (Ngày 1–3): Khởi tạo repo, thiết kế Figma, tạo CSDL SQL Server (`init_schema.sql`), khung FastAPI (`database.py`, `main.py`)
- [x] **M1** Tài khoản & Đa ngôn ngữ (Ngày 4–6): Đăng ký, đăng nhập, chế độ Khách (Guest), chọn ngôn ngữ, quản lý người dùng (`auth.py`, `auth_router.py`)
- [x] **M2** Quản trị nội dung CMS (Ngày 7–10): Thống kê thẻ hiện vật, thêm/sửa/xóa hiện vật đa ngôn ngữ, upload ảnh & file thuyết minh MP3 (`artifact_router.py`)
- [x] **M3** Hạ tầng iBeacon (Ngày 11–13): API đăng ký thiết bị iBeacon (`UUID`, `Major`, `Minor`), gán vào hiện vật, cấu hình bán kính & tọa độ sơ đồ (`beacon_router.py`)
- [ ] **M4** Nhận diện iBeacon tự động (Ngày 14–18): Tích hợp quét sóng BLE trên Mobile, lọc khoảng cách $\le 2.0\text{ m}$, chống lặp thông báo & tự bật Popup
- [ ] **M5** Trải nghiệm Đa phương tiện & Bản đồ (Ngày 19–22): Trình phát Audio Guide/Video, lưu tạm xem tiếp ngoài vùng sóng (Cache) & bản đồ sơ đồ di tích trên Mobile/Web
- [x] **M6** Tương tác khách tham quan - Backend API (Ngày 23–25): API lưu hiện vật yêu thích (Favorites), nhật ký lịch sử tham quan (Visit History), chấm sao & gửi đánh giá (`analytics_router.py`)
- [x] **M7** Thống kê & Quản trị nâng cao - Backend API (Ngày 26–28): API Dashboard biểu đồ lượt khách, Top hiện vật, ngôn ngữ, kiểm duyệt đánh giá & xuất báo cáo Excel/CSV (`analytics_router.py`)
- [ ] **M8** Phát hành, Tài liệu & Demo (Ngày 29–30): Đồng bộ toàn hệ thống Mobile + Web + Backend, hoàn thiện báo cáo Word (SRS/SDD), hướng dẫn sử dụng & quay video demo

---

## 11. Nhóm thực hiện

| Thành viên | Vai trò chính |
|---|---|
| **Phạm Gia Khiêm** (Leader - TV1) | Thiết kế CSDL SQL Server, phát triển Backend FastAPI & tích hợp hệ thống |
| **Nguyễn Tuấn Khang** (TV2) | Phát triển ứng dụng di động Android (Kotlin, Jetpack Compose, Quét sóng BLE iBeacon) |
| **Thành viên 3** (TV3) | Phát triển Web Admin CMS (Quản lý di tích, hiện vật đa ngôn ngữ & cấu hình iBeacon) |
| **Thành viên 4** (TV4) | Phát triển Dashboard Thống kê, Biểu đồ báo cáo, Xuất Excel/PDF & Quản lý phản hồi |
| **Thành viên 5** (TV5) | Thiết kế giao diện Figma, chuẩn bị Dữ liệu mẫu (Việt/Anh, Audio MP3) & Tài liệu báo cáo |