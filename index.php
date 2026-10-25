
<?php
session_start();

// Nếu đã đăng nhập với quyền ADMIN thì chuyển đến trang quản lý
if (
    isset($_SESSION['user_id']) &&
    isset($_SESSION['role']) &&
    $_SESSION['role'] === 'ADMIN'
) {
    header('Location: admin_dashboard.php');
    exit;
}

$error = $_SESSION['login_error'] ?? '';
unset($_SESSION['login_error']);
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>W1 - Đăng nhập Quản trị</title>

    <link rel="stylesheet" href="style/index.css" class="css">
</head>

<body>
    <div class="login-container">
        <h2>Đăng nhập Quản trị</h2>

        <p class="description">
            W1 - Administrator Login
        </p>

        <?php if ($error !== ''): ?>
            <div class="error">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form action="admin_auth.php" method="POST">
            <label for="username">Tên đăng nhập</label>
            <input
                type="text"
                id="username"
                name="username"
                required
                autocomplete="username"
            >

            <label for="password">Mật khẩu</label>
            <input
                type="password"
                id="password"
                name="password"
                required
                autocomplete="current-password"
            >

            <button type="submit">Đăng nhập</button>
        </form>
    </div>
</body>
</html>
