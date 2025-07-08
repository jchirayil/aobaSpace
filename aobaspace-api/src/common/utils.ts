/**
 * Generates a short, pseudo-unique alphanumeric ID.
 * This is for demonstration purposes. In a real production system,
 * you would need a more robust ID generation strategy that guarantees
 * uniqueness across your distributed system (e.g., KSUID, Nano ID, or
 * a custom sequence with collision detection and retries).
 *
 * @param length The desired length of the ID (default: 10)
 * @returns A string of random alphanumeric characters
 */
export function generateUniqueId(length: number = 10): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}