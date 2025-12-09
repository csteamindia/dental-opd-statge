const customEncrypt = (text) => {
  try {
    const salt = 'DENTAL2025';
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(charCode);
    }
    return Buffer.from(result).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

const customDecrypt = (encryptedText) => {
  try {
    const salt = 'DENTAL2025';
    const text = Buffer.from(encryptedText, 'base64').toString();
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

export { customEncrypt, customDecrypt };