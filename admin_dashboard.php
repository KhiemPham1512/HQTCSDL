
<?php
session_start();

// Kiểm tra đã đăng nhập hay chưa
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

// Kiểm tra quyền quản trị
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'ADMIN') {
    http_response_code(403);
    exit('403 Forbidden - Bạn không có quyền truy cập trang này.');
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Trang quản lý quản trị</title>
</head>

<body>
    <h1>Trang quản lý quản trị</h1>

    <p>
        Xin chào,
        <?= htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8') ?>!
    </p>

    <p>Quyền hiện tại: ADMIN</p>

    <a href="admin_logout.php">Đăng xuất</a>
</body>
</html>
