import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function chave(): Buffer {
  const base64 = process.env.ENCRYPTION_KEY;
  if (!base64) {
    throw new Error('ENCRYPTION_KEY não configurada no .env.');
  }
  const buffer = Buffer.from(base64, 'base64');
  if (buffer.length !== 32) {
    throw new Error('ENCRYPTION_KEY precisa decodificar para exatamente 32 bytes (256 bits).');
  }
  return buffer;
}

/** Cifra um texto com AES-256-GCM. Formato armazenado: "iv.authTag.ciphertext", tudo base64. */
export function encrypt(texto: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, chave(), iv);
  const ciphertext = Buffer.concat([cipher.update(texto, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${authTag.toString('base64')}.${ciphertext.toString('base64')}`;
}

/** Reverte encrypt(). Lança erro se o valor foi adulterado (falha na verificação do authTag). */
export function decrypt(cifrado: string): string {
  const [ivB64, authTagB64, ciphertextB64] = cifrado.split('.');
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error('Valor cifrado em formato inválido.');
  }
  const decipher = createDecipheriv(ALGORITHM, chave(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(authTagB64, 'base64'));
  const texto = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, 'base64')),
    decipher.final(),
  ]);
  return texto.toString('utf8');
}
