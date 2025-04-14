<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Bật hiển thị lỗi để debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Tải PHPMailer
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require __DIR__ . '/../vendor/autoload.php'; // Nếu dùng Composer
} else {
    require __DIR__ . '/../PHPMailer/src/Exception.php';
    require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/../PHPMailer/src/SMTP.php';
}

// Kiểm tra nếu form được submit
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $name_furi = htmlspecialchars(trim($_POST['name-furi'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $contact_type = htmlspecialchars(trim($_POST['contact-type'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message-details'] ?? ''));
    $privacy_agree = isset($_POST['privacy-agree']) ? '同意する' : '同意しない';

    // Kiểm tra dữ liệu bắt buộc
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'お名前は必須です。';
    }
    
    if (empty($name_furi)) {
        $errors[] = 'お名前（フリガナ）は必須です。';
    }
    
    if (empty($email)) {
        $errors[] = 'メールアドレスは必須です。';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = '正しいメールアドレスを入力してください。';
    }
    
    if (empty($contact_type)) {
        $errors[] = '問い合わせ種類を選択してください。';
    }

    // Nếu có lỗi, hiển thị thông báo và dừng lại
    if (!empty($errors)) {
        $error_message = implode("\\n", $errors);
        echo "<script>alert('以下のエラーがあります:\\n{$error_message}'); window.location.href='/xampp/Contact_Form/inquiry/contact.html';</script>";
        exit();
    }

    // Nếu không có lỗi, tiến hành gửi email
    $mail = new PHPMailer(true);

    try {
        // Cấu hình server SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'hoantelseai2801@gmail.com';
        $mail->Password = 'ttxzuowflyzjwvzh';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        // $mail->Port = 465;

        // Bật debug
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = 'html';

        // Cấu hình email
        $mail->setFrom('hoantelseai2801@gmail.com', 'ABNEW Contact Form');
        $mail->addAddress('hoantelseai2801@gmail.com');

        // Đặt mã hóa UTF-8 cho nội dung và tiêu đề
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';

        // Nội dung email
        $mail->isHTML(true);
        // Mã hóa tiêu đề tiếng Nhật để hiển thị đúng
        $mail->Subject = '=?UTF-8?B?' . base64_encode('お問い合わせ - 株式会社ABNEW') . '?=';
        $mail->Body = "
            <h2>お問い合わせ</h2>
            <p><strong>お名前:</strong> $name</p>
            <p><strong>お名前（フリガナ）:</strong> $name_furi</p>
            <p><strong>メールアドレス:</strong> $email</p>
            <p><strong>問い合わせ種類:</strong> $contact_type</p>
            <p><strong>問い合わせ内容詳細:</strong> $message</p>
            <p><strong>プライバシーポリシー同意:</strong> $privacy_agree</p>
        ";
        $mail->AltBody = "お名前: $name\nお名前（フリガナ）: $name_furi\nメールアドレス: $email\n問い合わせ種類: $contact_type\n問い合わせ内容詳細: $message\nプライバシーポリシー同意: $privacy_agree";

        // Gửi email
        $mail->send();
        echo "<script>alert('メールを送信しました！'); window.location.href='/xampp/Contact_Form/inquiry/contact.html';</script>";
    } catch (Exception $e) {
        echo "<script>alert('メール送信に失敗しました: {$mail->ErrorInfo}'); window.location.href='/xampp/Contact_Form/inquiry/contact.html';</script>";
    }
} else {
    // Nếu truy cập trực tiếp file mail.php
    header("Location: /xampp/Contact_Form/inquiry/contact.html");
    exit();
}
?>