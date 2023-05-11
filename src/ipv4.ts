export const VALID_IPV4_CHARS = '.0123456789';

export function parseIpv4(input: string): string | null {
  function readChunk(chunk: string) {
    // 1111 invalid
    if (chunk.length > 3) {
      return null;
    }

    // 0 valid, 01 invalid
    if (chunk.startsWith('0') && chunk.length > 1) {
      return null;
    }

    const parsed = parseInt(chunk, 10);

    if (parsed < 0 || parsed > 255) {
      return null;
    }

    return chunk;
  }

  const groups = input
    .split('.')
    .map(readChunk)
    .filter(x => !!x);

  return groups.length === 4 ? groups.join('.') : null;
}
