package com.ebank.util;

import com.ebank.repository.CompteBancaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.Random;

@Component
public class RibGenerator {

    @Autowired
    private CompteBancaireRepository compteBancaireRepository;

    private static final String[] BANK_CODES = {
            "011", "230", "007", "022", "125",
            "021", "080", "340", "013", "111"
    };

    /**
     * Generate a unique valid Moroccan RIB (24 digits)
     * Ensures the RIB doesn't already exist in database
     */
    public String generateRib() {
        String rib;
        int attempts = 0;
        int maxAttempts = 100; // Prevent infinite loop

        do {
            rib = generateRandomRib();
            attempts++;

            if (attempts >= maxAttempts) {
                throw new RuntimeException(
                        "Impossible de générer un RIB unique après " + maxAttempts + " tentatives"
                );
            }
        } while (compteBancaireRepository.existsByRib(rib));

        return rib;
    }

    /**
     * Generate a random valid RIB without checking database
     */
    private String generateRandomRib() {
        Random random = new Random();

        // Select random bank code
        String bankCode = BANK_CODES[random.nextInt(BANK_CODES.length)];

        // Generate random branch code (3 digits)
        String branchCode = String.format("%03d", random.nextInt(1000));

        // Generate random account number (16 digits)
        StringBuilder accountNumber = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            accountNumber.append(random.nextInt(10));
        }

        // Combine without key
        String ribWithoutKey = bankCode + branchCode + accountNumber.toString();

        // Calculate and add key
        String key = calculateRibKey(ribWithoutKey);

        return ribWithoutKey + key;
    }

    /**
     * Validate a Moroccan RIB
     */
    public boolean isValidRib(String rib) {
        if (rib == null || rib.length() != 24) {
            return false;
        }

        if (!rib.matches("\\d{24}")) {
            return false;
        }

        // Extract the key (last 2 digits)
        String providedKey = rib.substring(22);

        // Calculate expected key
        String ribWithoutKey = rib.substring(0, 22);
        String calculatedKey = calculateRibKey(ribWithoutKey);

        return providedKey.equals(calculatedKey);
    }

    /**
     * Calculate RIB key using modulo 97 algorithm
     */
    private String calculateRibKey(String ribWithoutKey) {
        try {
            BigInteger ribNumber = new BigInteger(ribWithoutKey);
            BigInteger modulo = new BigInteger("97");

            BigInteger remainder = ribNumber.mod(modulo);
            int key = 97 - remainder.intValue();

            return String.format("%02d", key);
        } catch (NumberFormatException e) {
            return "00";
        }
    }

    /**
     * Format RIB for display (BBB CCC AAAAAAAAAAAAAAAA KK)
     */
    public String formatRib(String rib) {
        if (rib == null || rib.length() != 24) {
            return rib;
        }

        return rib.substring(0, 3) + " " +    // Bank code
                rib.substring(3, 6) + " " +     // Branch code
                rib.substring(6, 22) + " " +    // Account number
                rib.substring(22);              // Key
    }
}