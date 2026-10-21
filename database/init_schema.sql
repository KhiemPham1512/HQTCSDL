-- =========================================================================
-- FILE: database/init_schema.sql (BẢN ĐỒNG BỘ 100% VỚI FIGMA WEB W1-W8 & MOBILE 1-10)
-- HỆ QUẢN TRỊ CSDL: MICROSOFT SQL SERVER
-- =========================================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SmartHeritageDB')
BEGIN
    CREATE DATABASE SmartHeritageDB;
END
GO

USE SmartHeritageDB;
GO

-- Xóa các bảng cũ nếu chạy lại
IF OBJECT_ID('dbo.Feedbacks', 'U') IS NOT NULL DROP TABLE dbo.Feedbacks;
IF OBJECT_ID('dbo.VisitLogs', 'U') IS NOT NULL DROP TABLE dbo.VisitLogs;
IF OBJECT_ID('dbo.Beacons', 'U') IS NOT NULL DROP TABLE dbo.Beacons;
IF OBJECT_ID('dbo.Artifacts', 'U') IS NOT NULL DROP TABLE dbo.Artifacts;
IF OBJECT_ID('dbo.Sites', 'U') IS NOT NULL DROP TABLE dbo.Sites;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
GO

-- =========================================================================
-- 1. BẢNG Users (Khớp với W1, W8 và Mobile 2, 3, 10)
-- =========================================================================
CREATE TABLE dbo.Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(150) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'VISITOR' CHECK (role IN ('ADMIN', 'CONTENT_MANAGER', 'VISITOR')),
    preferred_lang VARCHAR(10) NOT NULL DEFAULT 'vi' CHECK (preferred_lang IN ('vi', 'en', 'ko', 'ja', 'zh')),
    auto_beacon_notify BIT NOT NULL DEFAULT 1,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =========================================================================
-- 2. BẢNG Sites (Khớp với W6 và Mobile 4, 7)
-- =========================================================================
CREATE TABLE dbo.Sites (
    site_id INT IDENTITY(1,1) PRIMARY KEY,
    name_vi NVARCHAR(255) NOT NULL,
    name_en NVARCHAR(255) NOT NULL,
    description_vi NVARCHAR(MAX) NULL,
    description_en NVARCHAR(MAX) NULL,
    address NVARCHAR(500) NULL,
    floor_name NVARCHAR(150) NULL DEFAULT N'Tầng 1 - Khu trưng bày chính',
    map_image_url VARCHAR(500) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =========================================================================
-- 3. BẢNG Artifacts (Khớp với W3, W4 và Mobile 4, 5, 6, 7)
-- =========================================================================
CREATE TABLE dbo.Artifacts (
    artifact_id INT IDENTITY(1,1) PRIMARY KEY,
    site_id INT NOT NULL DEFAULT 1,
    artifact_code VARCHAR(50) NOT NULL UNIQUE,
    zone_name NVARCHAR(150) NOT NULL DEFAULT N'Khu trưng bày Đông Sơn - Tầng 1',
    name_vi NVARCHAR(255) NOT NULL,
    name_en NVARCHAR(255) NOT NULL,
    summary_vi NVARCHAR(500) NOT NULL,
    summary_en NVARCHAR(500) NOT NULL,
    description_vi NVARCHAR(MAX) NOT NULL,
    description_en NVARCHAR(MAX) NOT NULL,
    image_url VARCHAR(500) NULL,
    gallery_json NVARCHAR(MAX) NULL,
    audio_vi_url VARCHAR(500) NULL,
    audio_en_url VARCHAR(500) NULL,
    audio_duration_sec INT NOT NULL DEFAULT 225,
    translated_langs VARCHAR(50) NOT NULL DEFAULT 'VI,EN',
    map_x FLOAT NOT NULL DEFAULT 340.0,
    map_y FLOAT NOT NULL DEFAULT 215.0,
    status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'DRAFT', 'HIDDEN')),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Artifacts_Sites FOREIGN KEY (site_id) REFERENCES dbo.Sites(site_id) ON DELETE CASCADE
);
GO

-- =========================================================================
-- 4. BẢNG Beacons (Khớp với W5, W6 và Mobile 4, 5)
-- =========================================================================
CREATE TABLE dbo.Beacons (
    beacon_id INT IDENTITY(1,1) PRIMARY KEY,
    beacon_code VARCHAR(50) NOT NULL UNIQUE,
    artifact_id INT NULL UNIQUE,
    zone_name NVARCHAR(150) NULL DEFAULT N'Tầng 1 - Phòng Đông Sơn',
    uuid VARCHAR(36) NOT NULL DEFAULT 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
    major INT NOT NULL DEFAULT 1,
    minor INT NOT NULL,
    tx_power INT NOT NULL DEFAULT -59,
    trigger_distance FLOAT NOT NULL DEFAULT 2.0,
    battery_level INT NOT NULL DEFAULT 100,
    map_x FLOAT NOT NULL DEFAULT 340.0,
    map_y FLOAT NOT NULL DEFAULT 215.0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOW_BATTERY', 'LOST_SIGNAL')),
    last_seen_at DATETIME2 NULL DEFAULT SYSDATETIME(),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_Beacon_Signal UNIQUE (uuid, major, minor),
    CONSTRAINT FK_Beacons_Artifacts FOREIGN KEY (artifact_id) REFERENCES dbo.Artifacts(artifact_id) ON DELETE SET NULL
);
GO

-- =========================================================================
-- 5. BẢNG VisitLogs (Khớp với W2 và Mobile 9 - Yêu thích & Lịch sử)
-- =========================================================================
CREATE TABLE dbo.VisitLogs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    device_id VARCHAR(100) NULL,
    artifact_id INT NOT NULL,
    beacon_id INT NULL,
    lang_used VARCHAR(10) NOT NULL DEFAULT 'vi',
    duration_seconds INT NOT NULL DEFAULT 60,
    is_favorite BIT NOT NULL DEFAULT 0,
    visited_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_VisitLogs_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE SET NULL,
    CONSTRAINT FK_VisitLogs_Artifacts FOREIGN KEY (artifact_id) REFERENCES dbo.Artifacts(artifact_id) ON DELETE CASCADE
);
GO

-- =========================================================================
-- 6. BẢNG Feedbacks (Khớp với W7 và Mobile 6, 8 - Chia sẻ cảm nhận)
-- =========================================================================
CREATE TABLE dbo.Feedbacks (
    feedback_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    visitor_name NVARCHAR(150) NOT NULL DEFAULT N'Khách tham quan',
    artifact_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(1000) NULL,
    is_visible BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Feedbacks_Users FOREIGN KEY (user_id) REFERENCES dbo.Users(user_id) ON DELETE SET NULL,
    CONSTRAINT FK_Feedbacks_Artifacts FOREIGN KEY (artifact_id) REFERENCES dbo.Artifacts(artifact_id) ON DELETE CASCADE
);
GO

-- =========================================================================
-- DỮ LIỆU MẪU KHỚP CHÍNH XÁC VỚI NỘI DUNG TRÊN HÌNH FIGMA W1-W8 & MOBILE
-- =========================================================================

INSERT INTO dbo.Users (email, password_hash, full_name, role, preferred_lang, is_active)
VALUES 
('ngocanh@smartheritage.vn', '123456', N'Ngọc Anh (Admin)', 'ADMIN', 'vi', 1),
('minhduc@smartheritage.vn', '123456', N'Trần Minh Đức', 'CONTENT_MANAGER', 'vi', 1),
('lethuha@smartheritage.vn', '123456', N'Lê Thu Hà', 'CONTENT_MANAGER', 'en', 1),
('nguyenvana@email.com', '123456', N'Nguyễn Văn A', 'VISITOR', 'vi', 1),
('john.davis@gmail.com', '123456', N'John Davis', 'VISITOR', 'en', 1);

INSERT INTO dbo.Sites (name_vi, name_en, description_vi, description_en, address, floor_name, map_image_url)
VALUES (
    N'Bảo tàng Lịch sử Quốc gia',
    N'Vietnam National Museum of History',
    N'Nơi lưu giữ và trưng bày các bảo vật quốc gia trải dài từ thời tiền sử đến triều đại nhà Nguyễn.',
    N'Preserving and exhibiting national treasures from prehistoric times to the Nguyen Dynasty.',
    N'Số 1 Tràng Tiền, Hoàn Kiếm, Hà Nội / Số 2 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM',
    N'Tầng 1 - Khu trưng bày chính',
    '/static/images/floorplan_tang1.png'
);

INSERT INTO dbo.Artifacts 
(site_id, artifact_code, zone_name, name_vi, name_en, summary_vi, summary_en, description_vi, description_en, image_url, audio_vi_url, audio_en_url, audio_duration_sec, translated_langs, map_x, map_y, status)
VALUES
(1, 'HV-001', N'Khu trưng bày Đông Sơn - Tầng 1',
 N'Trống đồng Ngọc Lũ', N'Ngoc Lu Bronze Drum',
 N'Trống đồng Ngọc Lũ — Dấu ấn văn hóa Đông Sơn rực rỡ cách đây hơn 2.500 năm.',
 N'Ngoc Lu Bronze Drum — The pinnacle of ancient Dong Son bronze casting culture.',
 N'Trống đồng Ngọc Lũ là một trong những chiếc trống đồng cổ nhất và đẹp nhất thuộc nền văn hóa Đông Sơn (niên đại khoảng 2.500 năm trước). Mặt trống đúc nổi ngôi sao 14 cánh cùng các họa tiết chim Lạc và cảnh sinh hoạt của cư dân Việt cổ.',
 N'The Ngoc Lu Bronze Drum is the most iconic artifact of the Dong Son culture (dating back 2,500 years). Its tympanum features a 14-pointed star surrounded by Lac birds and scenes of ancient communal life.',
 '/static/images/hv_001.jpg', '/static/audio/ngoc-lu-thuyet-minh-vi.mp3', '/static/audio/ngoc-lu-thuyet-minh-en.mp3', 225, 'VI,EN,KO,JA', 340, 215, 'PUBLISHED'),

(1, 'HV-002', N'Phòng Gốm Cổ - Tầng 1',
 N'Bình gốm Chu Đậu', N'Chu Dau Ceramic Vase',
 N'Tuyệt tác gốm hoa lam Việt Nam thế kỷ XV với nét vẽ thủ công tinh xảo.',
 N'A 15th-century Vietnamese blue-and-white ceramic masterpiece.',
 N'Bình gốm hoa lam Chu Đậu (Hải Dương) có niên đại thế kỷ XV, nổi tiếng với lớp men trắng ngà trong trẻo và họa tiết hoa cúc, chim phượng vẽ bằng màu xanh coban.',
 N'Dating from the 15th century, Chu Dau blue-and-white ceramics are celebrated for their ivory glaze and intricate cobalt-blue floral motifs.',
 '/static/images/hv_002.jpg', '/static/audio/chu-dau-vi.mp3', '/static/audio/chu-dau-en.mp3', 180, 'VI,EN', 520, 180, 'PUBLISHED'),

(1, 'HV-003', N'Khu Chăm Pa - Tầng 1',
 N'Tượng Apsara', N'Champa Apsara Sandstone Relief',
 N'Phù điêu vũ nữ Apsara bằng đá sa thạch tiêu biểu cho nghệ thuật điêu khắc Chăm Pa.',
 N'Sandstone relief of an Apsara celestial dancer from the Champa Kingdom.',
 N'Tượng vũ nữ Apsara thuộc phong cách nghệ thuật Trà Kiệu (thế kỷ X), thể hiện đường nét uyển chuyển và nghệ thuật chạm khắc đá sa thạch đỉnh cao của vương quốc Chăm Pa.',
 N'Carved in the 10th-century Tra Kieu style, this sandstone Apsara dancer embodies the grace and sculptural mastery of the Champa civilization.',
 '/static/images/hv_003.jpg', '/static/audio/apsara-vi.mp3', '/static/audio/apsara-en.mp3', 195, 'VI,EN,JA', 280, 420, 'PUBLISHED'),

(1, 'HV-004', N'Khu trưng bày Đông Sơn - Tầng 1',
 N'Thạp đồng Đào Thịnh', N'Dao Thinh Bronze Jar',
 N'Bảo vật quốc gia phản ánh tín ngưỡng phồn thực và kỹ thuật đúc đồng Đông Sơn.',
 N'National treasure reflecting fertility beliefs and Dong Son bronze mastery.',
 N'Thạp đồng Đào Thịnh có kích thước đồ sộ và nắp đúc tượng các cặp đôi nam nữ, phản ánh đời sống tâm linh và ước vọng sinh sôi nảy nở của cư dân nông nghiệp lúa nước.',
 N'The monumental Dao Thinh bronze jar features figurines on its lid, symbolizing fertility rituals of ancient wet-rice agricultural communities.',
 '/static/images/hv_004.jpg', '/static/audio/dao-thinh-vi.mp3', '/static/audio/dao-thinh-en.mp3', 210, 'VI,EN', 410, 310, 'PUBLISHED'),

(1, 'HV-005', N'Phòng Triều Nguyễn - Tầng 1',
 N'Ấn vàng Triều Nguyễn', N'Nguyen Dynasty Imperial Golden Seal',
 N'Bảo vật hoàng cung biểu trưng cho quyền lực tối cao của các vị vua nhà Nguyễn.',
 N'Imperial golden seal symbolizing the supreme authority of the Nguyen Emperors.',
 N'Chiếc ấn vàng đúc dưới triều vua Minh Mạng năm 1823 với núm ấn hình rồng uốn lượn, được sử dụng trong các đại lễ và văn kiện trọng đại của triều đình Huế.',
 N'Cast in 1823 during Emperor Minh Mang reign, this dragon-knobbed golden seal was used for the most solemn imperial decrees of the Hue Court.',
 '/static/images/hv_005.jpg', '/static/audio/an-vang-vi.mp3', '/static/audio/an-vang-en.mp3', 240, 'VI,EN,KO', 610, 450, 'PUBLISHED');

INSERT INTO dbo.Beacons (beacon_code, artifact_id, zone_name, uuid, major, minor, trigger_distance, battery_level, map_x, map_y, status)
VALUES
('BC-001', 1, N'Tầng 1 - Phòng Đông Sơn', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 101, 2.0, 95, 340, 215, 'ACTIVE'),
('BC-002', 2, N'Tầng 1 - Phòng Gốm Cổ', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 102, 2.5, 88, 520, 180, 'ACTIVE'),
('BC-003', 3, N'Tầng 1 - Khu Chăm Pa', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 103, 1.5, 18, 280, 420, 'LOW_BATTERY'),
('BC-004', 4, N'Tầng 1 - Phòng Đông Sơn', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 104, 2.0, 0, 410, 310, 'LOST_SIGNAL'),
('BC-005', 5, N'Tầng 1 - Phòng Triều Nguyễn', 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 105, 2.0, 92, 610, 450, 'ACTIVE');

INSERT INTO dbo.VisitLogs (user_id, artifact_id, beacon_id, lang_used, duration_seconds, is_favorite)
VALUES
(4, 1, 1, 'vi', 145, 1),
(4, 2, 2, 'vi', 95, 1),
(5, 1, 1, 'en', 180, 1),
(5, 3, 3, 'en', 110, 0);

INSERT INTO dbo.Feedbacks (user_id, visitor_name, artifact_id, rating, comment, is_visible)
VALUES
(4, N'Nguyễn Minh', 1, 5, N'Thuyết minh tự động rất nhạy, đi tới gần là máy tự hiện thông tin Trống đồng Ngọc Lũ rất tiện lợi.', 1),
(5, N'John Davis', 2, 5, N'Beautiful Chu Dau ceramic vase! The English audio guide made the history come alive.', 1),
(NULL, N'Trần Bảo Ngọc', 3, 4, N'Không gian trưng bày đẹp, âm thanh thuyết minh rõ ràng dễ nghe.', 1);
GO