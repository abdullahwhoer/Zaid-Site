<?php
if($_SERVER['REQUEST_METHOD'] == "POST"){

    // 1. Your email where messages will be sent
    $to = "abdullahwhoer@gmail.com"; // <-- Replace with your email

    // 2. Email subject
    $subject = "New Contact Form Message";

    // 3. Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $message = $_POST['message'];

    // 4. Create email body
    $body = "Name: $name\nEmail: $email\nPhone: $phone\n\nMessage:\n$message";

    // 5. Email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";

    // 6. Send email
    if(mail($to, $subject, $body, $headers)){
        echo "Message sent successfully!";
    } else {
        echo "Failed to send message.";
    }
}
?>