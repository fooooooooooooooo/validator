import { VALID_IPV4_CHARS, parseIpv4 } from './ipv4';
import { VALID_IPV6_CHARS, parseIpv6 } from './ipv6';

function containsInvalidChars(input: string, validChars: string): boolean {
  for (let i = 0; i < input.length; i++) {
    if (!validChars.includes(input[i])) {
      return true;
    }
  }

  return false;
}

export function parseIp(input: string): string | null {
  if (typeof input !== 'string') {
    return null;
  }

  // less than ::1 or greater than 0000:0000:0000:0000:0000:0000:0000:0000
  if (input.length < 3 || input.length > 39) {
    return null;
  }

  if (input.includes('.') && !input.includes(':')) {
    // chars outside .0123456789
    if (containsInvalidChars(input, VALID_IPV4_CHARS)) {
      return null;
    }

    return parseIpv4(input);
  }

  if (input.includes(':')) {
    // chars outside .:0123456789abcdefABCDEF
    if (containsInvalidChars(input, VALID_IPV6_CHARS)) {
      return null;
    }

    return parseIpv6(input);
  }

  return null;
}
