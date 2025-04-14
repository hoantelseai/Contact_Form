<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Đường dẫn đến PHPMailer

// Hàm làm sạch dữ liệu đầu vào
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Kiểm tra nếu form được submit
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form và làm sạch
    $name = sanitize_input($_POST['name']);
    $name_furi = sanitize_input($_POST['name-furi']);
    $email = sanitize_input($_POST['email']);
    $confirm_email = sanitize_input($_POST['confirm-email']);
    $contact_type = sanitize_input($_POST['contact-type']);
    $message_details = sanitize_input($_POST['message-details']);
    $privacy_agree = isset($_POST['privacy-agree']) ? 'Yes' : 'No';

    // Kiểm tra dữ liệu bắt buộc
    $errors = [];
    if (empty($name)) {
        $errors[] = "お名前は必須です。";
    }
    if (empty($name_furi)) {
        $errors[] = "お名前（フリガナ）は必須です。";
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "正しいメールアドレスを入力してください。";
    }
    if ($email !== $confirm_email) {
        $errors[] = "メールアドレスが一致しません。";
    }
    if (empty($contact_type)) {
        $errors[] = "問い合わせ種類を選択してください。";
    }
    if ($privacy_agree !== 'Yes') {
        $errors[] = "プライバシーポリシーに同意してください。";
    }

    // Nếu không có lỗi, tiến hành gửi email
    if (empty($errors)) {
        // Cấu hình email
        $to = "np-hoan@jinso.co.jp"; // Địa chỉ email nhận
        $subject = "お問い合わせ - 株式会社ABNEW";
        $body = "お名前: $name\n";
        $body .= "お名前（フリガナ）: $name_furi\n";
        $body .= "メールアドレス: $email\n";
        $body .= "問い合わせ種類: $contact_type\n";
        $body .= "問い合わせ内容詳細:\n$message_details\n";
        $body .= "プライバシーポリシー同意: $privacy_agree\n";

        // Tiêu đề email (hỗ trợ tiếng Nhật)
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        // Gửi email
        if (mail($to, $subject, $body, $headers)) {
            // Chuyển hướng đến trang cảm ơn
            header("Location: thank_you.html");
            exit();
        } else {
            $errors[] = "メール送信に失敗しました。もう一度お試しください。";
        }
    }

    // Nếu có lỗi, hiển thị lại form với thông báo lỗi
    if (!empty($errors)) {
        echo "<h2>エラー</h2>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
        echo '<a href="contact.html">戻る</a>';
    }
} else {
    // Nếu không phải POST, chuyển hướng về form
    header("Location: contact.html");
    exit();
}
?>