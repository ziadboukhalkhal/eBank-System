package com.ebank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendClientCredentials(String email, String login, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Bienvenue à eBank - Vos identifiants de connexion");
        message.setText(String.format(
                "Bonjour,\n\n" +
                        "Votre compte eBank a été créé avec succès.\n\n" +
                        "Vos identifiants de connexion:\n" +
                        "Login: %s\n" +
                        "Mot de passe: %s\n\n" +
                        "Nous vous recommandons de changer votre mot de passe lors de votre première connexion.\n\n" +
                        "Cordialement,\n" +
                        "L'équipe eBank",
                login, password
        ));

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
}