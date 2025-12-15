package com.ebank.service;

import com.ebank.dto.ChangePasswordRequest;
import com.ebank.dto.LoginRequest;
import com.ebank.dto.LoginResponse;
import com.ebank.entity.Client;
import com.ebank.entity.User;
import com.ebank.exception.BusinessException;
import com.ebank.repository.ClientRepository;
import com.ebank.repository.UserRepository;
import com.ebank.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
        );

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getLogin());

        // Generate token
        String token = jwtUtil.generateToken(userDetails);

        // Get user info
        User user = userRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

        Long clientId = null;
        if (user.getRole().name().equals("CLIENT")) {
            Client client = clientRepository.findAll().stream()
                    .filter(c -> c.getUser() != null && c.getUser().getId().equals(user.getId()))
                    .findFirst()
                    .orElse(null);
            if (client != null) {
                clientId = client.getId();
            }
        }

        return new LoginResponse(token, user.getLogin(), user.getRole(), user.getId(), clientId);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User user = userRepository.findByLogin(currentUsername)
                .orElseThrow(() -> new BusinessException("Utilisateur non trouvé"));

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BusinessException("Ancien mot de passe incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}