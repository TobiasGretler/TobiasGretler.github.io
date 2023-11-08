<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Empfangen der Formulardaten
    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // Empfänger-E-Mail-Adresse (Ihre E-Mail-Adresse)
    $to = "txbitxbios@gmail.com";

    // Betreff der E-Mail
    $email_subject = "Kontaktformular: $subject";

    // Nachricht-Zusammenstellung
    $email_body = "Name: $name\n";
    $email_body .= "E-Mail: $email\n";
    $email_body .= "Nachricht:\n$message";

    // E-Mail-Header
    $headers = "From: $email\n";
    $headers .= "Reply-To: $email\n";

    // E-Mail senden
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "success"; // Erfolgsnachricht, die von JavaScript erkannt wird
    } else {
        echo "error"; // Fehlermeldung, die von JavaScript erkannt wird
    }
} else {
    // Wenn das Skript nicht über POST aufgerufen wird, wird eine Fehlermeldung zurückgegeben
    echo "error";
}
?>
