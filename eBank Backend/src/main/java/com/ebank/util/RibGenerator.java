package com.ebank.util;

import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.Random;

@Component
public class RibGenerator {

    private static final String[] BANK_CODES = {
            "011", // Attijariwafa Bank
            "230", // BMCE Bank
            "007", // CIH Bank
            "022", // Crédit du Maroc
            "125", // Banque Populaire
            "021", // BMCI
            "080", // Al Barid Bank
            "340", // Société Générale
            "013", // Crédit Agricole
            "111"  // Bank of Africa
    };

    /**
     * Generate a valid Moroccan RIB (24 digits)
     * Structure: BBB-CCC-AAAAAAAAAAAAAAAA-KK
     * B = Bank code (3 digits)
     * C = Branch code (3 digits)
     * A = Account number (16 digits)
     * K = Key (2 digits checksum)
     */
    public String generateRib() {
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
     * Using BigInteger to handle large numbers
     */
    private String calculateRibKey(String ribWithoutKey) {
        try {
            // Use BigInteger for large number calculation
            BigInteger ribNumber = new BigInteger(ribWithoutKey);
            BigInteger modulo = new BigInteger("97");

            // Calculate: 97 - (RIB mod 97)
            BigInteger remainder = ribNumber.mod(modulo);
            int key = 97 - remainder.intValue();

            return String.format("%02d", key);
        } catch (NumberFormatException e) {
            // Fallback: if somehow the number is invalid, return "00"
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