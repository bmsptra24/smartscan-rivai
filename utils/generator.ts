/**
 * @returns {string} A UUID v4 string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // Generate a random number between 0 and 15 (0-f in hex)
    const r = Math.random() * 16 | 0;

    // For 'x' characters, use the random value
    // For 'y' characters, use (r & 0x3 | 0x8) to ensure the UUID version is valid
    // This sets bits according to the UUID v4 standard
    const v = c === 'x' ? r : (r & 0x3 | 0x8);

    // Convert to hexadecimal
    return v.toString(16);
  });
}