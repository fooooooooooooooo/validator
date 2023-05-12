import { VALID_IPV4_CHARS, parseIpv4 } from './ipv4.js';

export const VALID_IPV6_CHARS = VALID_IPV4_CHARS + ':abcdefABCDEF';

export function parseIpv6(input: string): string | null {
  if (input.includes(' ') || input.includes(':::')) {
    return null;
  }

  const groups = input.split(':');

  const lastGroup = groups[groups.length - 1];

  // ipv4 mapped ipv6 group
  if (lastGroup.includes('.')) {
    let ipv4 = parseIpv4(lastGroup);

    if (ipv4 === null) {
      return null;
    }

    // 127.1.2.255 > [7f, 01, 02, ff]
    let chunks = ipv4.split('.').map(x => parseInt(x, 10).toString(16).padStart(2, '0'));

    // replace last group with [7f01, 02ff]
    groups.splice(groups.length - 1, 1, chunks[0] + chunks[1], chunks[2] + chunks[3]);
  }

  if (groups.some(x => x.length > 4)) {
    return null;
  }

  // min ::1 max 1:1:1:1:1:1:1:1
  if (groups.length < 3 || groups.length > 8) {
    return null;
  }

  // find first :: group
  let shorthandIndex = groups.findIndex(x => x === '');

  // If the address contains a shorthand group, expand it to its full form
  if (shorthandIndex !== -1) {
    const numGroups = 8 - groups.length;
    const expandedShorthand = Array(numGroups).fill('');

    groups.splice(shorthandIndex, 0, ...expandedShorthand);
  } else if (groups.length != 8) {
    // no shorthand groups and length < 8
    return null;
  }

  if (groups.length !== 8) {
    return null;
  }

  // pad all groups to 4 lowercase chars then join
  return groups.map(x => x.padStart(4, '0').toLowerCase()).join(':');
}
