
<?php
session_start();

require_once 'config.php';

// Chỉ chấp nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === '' || $password === '') {
    $_SESSION['login_error'] = 'Vui lòng nhập đầy đủ thông tin.';
    header('Location: index.php');
    exit;
}

try {
    // Truy vấn tài khoản bằng prepared statement
    $sql = "SELECT id, username, password, role
            FROM users
            WHERE username = :username
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'username' => $username
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Kiểm tra tài khoản và mật khẩu
    if (!$user || !password_verify($password, $user['password'])) {
        $_SESSION['login_error'] = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        header('Location: index.php');
        exit;
    }

    // Chỉ tài khoản ADMIN mới được đăng nhập trang quản trị
    if ($user['role'] !== 'ADMIN') {
        $_SESSION['login_error'] = 'Bạn không có quyền truy cập quản trị.';
        header('Location: index.php');
        exit;
    }

    // Ngăn session fixation
    session_regenerate_id(true);

    // Lưu thông tin xác thực vào session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];

    // Đăng nhập thành công
    header('Location: admin_dashboard.php');
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());

    $_SESSION['login_error'] = 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.';
    header('Location: index.php');
    exit;
}