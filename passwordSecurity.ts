
/**
 * Password security utilities for SubhPass
 */

// Simple entropy calculation for password strength
export const calculatePasswordEntropy = (password: string): number => {
  let charset = 0;
  
  // Check for different character types
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 33; // Special characters
  
  // Calculate bits of entropy
  return Math.log2(Math.pow(charset, password.length));
};

// Check for common patterns that weaken passwords
export const hasCommonPatterns = (password: string): boolean => {
  // Check for sequences
  const sequences = ['123', '234', '345', '456', '567', '678', '789', '987', '876', 'abc', 'bcd', 'cde', 'def'];
  let hasSequence = false;
  
  sequences.forEach(seq => {
    if (password.toLowerCase().includes(seq)) {
      hasSequence = true;
    }
  });
  
  // Check for repeating characters
  const hasRepeats = /(.)\1{2,}/.test(password);
  
  return hasSequence || hasRepeats;
};

// Generate a cryptographically secure random password
export const generateSecurePassword = (
  length = 16,
  options = { 
    uppercase: true, 
    lowercase: true, 
    numbers: true, 
    symbols: true 
  }
): string => {
  let charset = '';
  if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Generate secure random values
  const getRandomChar = () => {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return charset[randomValues[0] % charset.length];
  };
  
  let password = '';
  for (let i = 0; i < length; i++) {
    password += getRandomChar();
  }
  
  // Ensure at least one character from each selected type is included
  let finalPassword = password;
  if (options.lowercase && !/[a-z]/.test(finalPassword)) {
    finalPassword = 'a' + finalPassword.slice(1);
  }
  if (options.uppercase && !/[A-Z]/.test(finalPassword)) {
    finalPassword = finalPassword.slice(0, 1) + 'A' + finalPassword.slice(2);
  }
  if (options.numbers && !/[0-9]/.test(finalPassword)) {
    finalPassword = finalPassword.slice(0, 2) + '7' + finalPassword.slice(3);
  }
  if (options.symbols && !/[^a-zA-Z0-9]/.test(finalPassword)) {
    finalPassword = finalPassword.slice(0, 3) + '!' + finalPassword.slice(4);
  }
  
  return finalPassword;
};

// Simple "mask" function to partially hide a password for display
export const maskPassword = (password: string): string => {
  if (!password) return '';
  if (password.length <= 4) return '•'.repeat(password.length);
  
  return password.substring(0, 2) + '•'.repeat(password.length - 4) + password.substring(password.length - 2);
};

// Check estimated time to crack (very simple estimation)
export const estimateTimeToCrack = (password: string): string => {
  const entropy = calculatePasswordEntropy(password);
  
  // Estimates based on 10 billion guesses per second (modern hardware)
  if (entropy < 40) return 'Seconds to minutes';
  if (entropy < 60) return 'Hours to days';
  if (entropy < 80) return 'Months to years';
  if (entropy < 100) return 'Centuries';
  return 'Millennia';
};
