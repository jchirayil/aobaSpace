/**
 * Generates a short, pseudo-unique alphanumeric ID in the format XXXX-XXXXX.
 * This is for demonstration purposes. In a real production system,
 * you would need a more robust ID generation strategy that guarantees
 * uniqueness across your distributed system (e.g., KSUID, Nano ID, or
 * a custom sequence with collision detection and retries).
 *
 * @returns A string of random alphanumeric characters in XXXX-XXXXX format
 */
export function generateUniqueId(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  const segment1Length = 4;
  const segment2Length = 5;

  // Generate first segment (4 characters)
  for (let i = 0; i < segment1Length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  result += '-'; // Add the hyphen

  // Generate second segment (5 characters)
  for (let i = 0; i < segment2Length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result; // Total length will be 4 + 1 + 5 = 10
}