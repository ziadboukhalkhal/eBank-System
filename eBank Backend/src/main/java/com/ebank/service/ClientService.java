package com.ebank.service;

import com.ebank.dto.ClientRequest;
import com.ebank.dto.ClientResponse;
import com.ebank.entity.Client;
import com.ebank.entity.Role;
import com.ebank.entity.User;
import com.ebank.exception.BusinessException;
import com.ebank.exception.ResourceNotFoundException;
import com.ebank.repository.ClientRepository;
import com.ebank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public ClientResponse createClient(ClientRequest request) {
        // RG_4: Verify unique numeroIdentite
        if (clientRepository.existsByNumeroIdentite(request.getNumeroIdentite())) {
            throw new BusinessException("Le numéro d'identité existe déjà");
        }

        // RG_6: Verify unique email
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("L'adresse email existe déjà");
        }

        // Generate login and password
        String login = generateLogin(request.getNom(), request.getPrenom());
        String rawPassword = generatePassword();

        // Create user
        User user = new User();
        user.setLogin(login);
        user.setPassword(passwordEncoder.encode(rawPassword)); // RG_1: Encrypt password
        user.setRole(Role.CLIENT);
        user = userRepository.save(user);

        // Create client
        Client client = new Client();
        client.setNom(request.getNom());
        client.setPrenom(request.getPrenom());
        client.setNumeroIdentite(request.getNumeroIdentite());
        client.setDateAnniversaire(request.getDateAnniversaire());
        client.setEmail(request.getEmail());
        client.setAdressePostale(request.getAdressePostale());
        client.setUser(user);

        client = clientRepository.save(client);

        // RG_7: Send email with credentials
        emailService.sendClientCredentials(client.getEmail(), login, rawPassword);

        return mapToResponse(client);
    }

    public List<ClientResponse> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
        return mapToResponse(client);
    }

    public ClientResponse getClientByNumeroIdentite(String numeroIdentite) {
        Client client = clientRepository.findByNumeroIdentite(numeroIdentite)
                .orElseThrow(() -> new ResourceNotFoundException("Client non trouvé"));
        return mapToResponse(client);
    }

    private String generateLogin(String nom, String prenom) {
        String baseLogin = (prenom.charAt(0) + nom).toLowerCase().replaceAll("\\s+", "");
        String login = baseLogin;
        int counter = 1;

        while (userRepository.existsByLogin(login)) {
            login = baseLogin + counter++;
        }

        return login;
    }

    private String generatePassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

    private ClientResponse mapToResponse(Client client) {
        ClientResponse response = new ClientResponse();
        response.setId(client.getId());
        response.setNom(client.getNom());
        response.setPrenom(client.getPrenom());
        response.setNumeroIdentite(client.getNumeroIdentite());
        response.setDateAnniversaire(client.getDateAnniversaire());
        response.setEmail(client.getEmail());
        response.setAdressePostale(client.getAdressePostale());
        if (client.getUser() != null) {
            response.setLogin(client.getUser().getLogin());
        }
        return response;
    }
}