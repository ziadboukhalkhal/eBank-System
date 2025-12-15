package com.ebank;

import com.ebank.entity.Role;
import com.ebank.entity.User;
import com.ebank.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class EbankApplication {

    public static void main(String[] args) {
        SpringApplication.run(EbankApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default AGENT_GUICHET if not exists
            if (!userRepository.existsByLogin("agent")) {
                User agent = new User();
                agent.setLogin("agent");
                agent.setPassword(passwordEncoder.encode("agent123"));
                agent.setRole(Role.AGENT_GUICHET);
                userRepository.save(agent);
                System.out.println("Default agent created: login=agent, password=agent123");
            }
        };
    }
}