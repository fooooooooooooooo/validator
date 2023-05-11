import { describe, expect, it } from 'vitest';
import { parseIpv4 } from '../ipv4.js';
import { parseIpv6 } from '../ipv6.js';
import { parseIp } from '../index.js';

const validIpv4Addresses = [
  '1.2.3.4',
  '10.0.0.1',
  '172.16.0.1',
  '192.0.2.1',
  '192.168.0.1',
  '198.51.100.1',
  '203.0.113.1',
  '224.0.0.1',
  '240.0.0.1',
  '255.255.255.255',
];

const invalidIpv4Addresses = [
  '256.0.0.0',
  '192.168.0',
  '192.168.0.1.2',
  '192.168.0.01',
  '192.168.0.256',
  '192.168.0.-1',
  '192.168.0.1.1.1',
  '192.168.0.',
  '192.168.0.0/24',
  ' 192.168.0.0',
];

const validIpv6Addresses = [
  ['2001:0db8:85a3:0000:0000:8a2e:0370:7334', '2001:0db8:85a3:0000:0000:8a2e:0370:7334'],
  ['2001:db8:85a3::8a2e:0370:7334', '2001:0db8:85a3:0000:0000:8a2e:0370:7334'],
  ['::1', '0000:0000:0000:0000:0000:0000:0000:0001'],
  ['fe80::1', 'fe80:0000:0000:0000:0000:0000:0000:0001'],
  ['::ffff:192.0.2.1', '0000:0000:0000:0000:0000:ffff:c000:0201'],
  ['2001:0db8::1:0:0:0:1', '2001:0db8:0000:0001:0000:0000:0000:0001'],
  ['2001:db8::1:0:0:0:1', '2001:0db8:0000:0001:0000:0000:0000:0001'],
  ['2001:0db8:1234:5678::9abc', '2001:0db8:1234:5678:0000:0000:0000:9abc'],
  ['2001:0db8:85a3:0000:0000:8a2e::7334', '2001:0db8:85a3:0000:0000:8a2e:0000:7334'],
  ['ff02::2', 'ff02:0000:0000:0000:0000:0000:0000:0002'],
  ['2001:db8:aaaa:bbbb:cccc:dddd:eeee:aaaa', '2001:0db8:aaaa:bbbb:cccc:dddd:eeee:aaaa'],
  ['2001:db8:aaaa:bbbb:cccc:dddd:eeee:AAAA', '2001:0db8:aaaa:bbbb:cccc:dddd:eeee:aaaa'],
  ['2001:db8:aaaa:bbbb:cccc:dddd:eeee:AaAa', '2001:0db8:aaaa:bbbb:cccc:dddd:eeee:aaaa'],
  ['2001:db8:0:0:0::1', '2001:0db8:0000:0000:0000:0000:0000:0001'],
  ['2001:db8:0:0::1', '2001:0db8:0000:0000:0000:0000:0000:0001'],
  ['2001:db8:0::1', '2001:0db8:0000:0000:0000:0000:0000:0001'],
  ['2001:db8::1', '2001:0db8:0000:0000:0000:0000:0000:0001'],
  ['2001:0db8:0000:0000:1111:2222:3333:4444', '2001:0db8:0000:0000:1111:2222:3333:4444'],
  ['::ffff:192.168.1.1', '0000:0000:0000:0000:0000:ffff:c0a8:0101'],
  ['::ffff:0:0', '0000:0000:0000:0000:0000:ffff:0000:0000'],
  ['::ffff:127.0.0.1', '0000:0000:0000:0000:0000:ffff:7f00:0001'],
  ['::ffff:255.255.255.255', '0000:0000:0000:0000:0000:ffff:ffff:ffff'],
  ['2001:db8::ffff:192.0.2.1', '2001:0db8:0000:0000:0000:ffff:c000:0201'],
];

const invalidIpv6Addresses = [
  '2001:0db8:85a3:0000:0000:8a2e:0370:7334:7334',
  '2001:db8:85a3::8a2e:0370:7334:7334:',
  '2001:0db8:85a3::8a2e:0370:7334:7334:',
  '2001:db8:85a3:8a2e::0370:7334:7334:',
  '2001:db8:85a3:8a2e::370:7334:7334:',
  '2001:db8:85a3:8a2e:::370:7334:7334',
  '2001:0db8:85a3:0000:0000:8a2e:0370:7334::',
  '2001:0db8:85a3::8a2e:0370:7334:7334:7334',
  '2001:0db8:85a3::::8a2e:0370:7334:7334:7334',
  '2001:0db8:85a38a2e:0370:7334:7334:7334',
  '::2001:0db8:85a3:0000:0000:8a2e:0370:7334',
  '2001:db8:a0b:12f0::::0:1',
  'fe80:2030:31:24',
  '',
  '1',
  ':1',
  ':::1',
  '::::1',
  ':::::1',
  ':::::::1',
  ' ::1',
  '::ffff:192.168.1.256',
  '::ffff:192.168.01.1',
  '::ffff:192.168.1.',
  '::ffff:192.168.1.1.1',
  '::ffff:192.168.1',
];

describe('parseIpv4()', () => {
  describe('given valid ipv4', () => {
    for (const ip of validIpv4Addresses) {
      describe(`given \`${ip}\``, () => {
        it('parses correctly', () => {
          expect(parseIpv4(ip)).toEqual(ip);
        });
      });
    }
  });

  describe('given invalid ipv4', () => {
    for (const ip of invalidIpv4Addresses) {
      describe(`given \`${ip}\``, () => {
        it('returns null', () => {
          expect(parseIpv4(ip)).toBeNull();
        });
      });
    }
  });
});

describe('parseIpv6()', () => {
  describe('given valid ipv6', () => {
    for (const [ip, expandedIp] of validIpv6Addresses) {
      describe(`given \`${ip}\``, () => {
        it('parses correctly', () => {
          expect(parseIpv6(ip)).toEqual(expandedIp);
        });
      });
    }
  });

  describe('given invalid ipv6', () => {
    for (const ip of invalidIpv6Addresses) {
      describe(`given \`${ip}\``, () => {
        it('returns null', () => {
          expect(parseIpv6(ip)).toBeNull();
        });
      });
    }
  });
});

describe('parseIp()', () => {
  describe('given valid ipv4', () => {
    for (const ip of validIpv4Addresses) {
      describe(`given \`${ip}\``, () => {
        it('parses correctly', () => {
          expect(parseIp(ip)).toEqual(ip);
        });
      });
    }
  });

  describe('given invalid ipv4', () => {
    for (const ip of invalidIpv4Addresses) {
      describe(`given \`${ip}\``, () => {
        it('returns null', () => {
          expect(parseIp(ip)).toBeNull();
        });
      });
    }
  });

  describe('given valid ipv6', () => {
    for (const [ip, expandedIp] of validIpv6Addresses) {
      describe(`given \`${ip}\``, () => {
        it('parses correctly', () => {
          expect(parseIp(ip)).toEqual(expandedIp);
        });
      });
    }
  });

  describe('given invalid ipv6', () => {
    for (const ip of invalidIpv6Addresses) {
      describe(`given \`${ip}\``, () => {
        it('returns null', () => {
          expect(parseIp(ip)).toBeNull();
        });
      });
    }
  });
});
