import { resourceAccess } from './resource-access';

const accessTokenWithResourceAccess =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZXhhbXBsZS1jbGllbnQiLCJhY2NvdW50Il0sInR5cCI6' +
  'IkJlYXJlciIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVzb3VyY2VfYWNjZXNzI' +
  'jp7ImV4YW1wbGUtY2xpZW50Ijp7InJvbGVzIjpbInNlcnZpY2Utb3duZXIiLCJ0ZXN0MSJdfSwiYWNjb3VudCI6eyJyb2' +
  'xlcyI6WyJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.xiQfMkFrkr_lx0LHtg6' +
  'XKvIOhvtb6qYpDc5Ve__-9w8';
const accessTokenWithSpecialCharAndResourceAccess =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZXhhbXBsZS1jbGllbnQiLCJhY2NvdW50Il0sInR5cCI6' +
  'IkJlYXJlciIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVzb3VyY2VfYWNjZXNzI' +
  'jp7ImV4YW1wbGUtY2xpZW50Ijp7InJvbGVzIjpbInNlcnZpY2Utb3duZXLDryIsInRlc3QxIl19LCJhY2NvdW50Ijp7In' +
  'JvbGVzIjpbInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJuYW1lIjoiVGVzdCB' +
  '3aXRoIMOvIHVuaWNvZGUgbWFuIGVycm9yIiwiZnVsbF9uYW1lIjoidGhpcyDDryBpcyBhIGRlc2NyaXB0aW9uIHRvIGdl' +
  'bmVyYXRlIGEgbG9uZ2VyIGFjY2Vzcy10b2tlbiDhuLQifQ.NZlHyDkYE4RUVoeSEqRD_2GZl47PjqpH8RpLtAoD0w0';
const accessTokenWithoutResourceAccess =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZXhhbXBsZS1jbGllbnQiLCJhY2NvdW50Il0sInR5cCI6' +
  'IkJlYXJlciIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwic2NvcGUiOiJvcGVuaWQgc' +
  'HJvZmlsZSBlbWFpbCJ9.hj-i3mSENrGJgKcdVrspwhanaVFv3mcM0Y3eanO1liE';
const accessTokenWithEmptyResourceAccess =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZXhhbXBsZS1jbGllbnQiLCJhY2NvdW50Il0sInR5cCI6' +
  'IkJlYXJlciIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjQyMDAiXSwicmVzb3VyY2VfYWNjZXNzI' +
  'jpudWxsLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.2Ot4iBWalrdV5kQVaDsop7zffn9EAQzll4XfQA3gvI8';

describe('resourceAccess', () => {
  it('should return null on empty', () => {
    expect(resourceAccess('')).toBeNull();
  });

  it('should return null on empty getAccessToken()', () => {
    expect(resourceAccess({ getAccessToken: () => '' })).toBeNull();
  });

  it('should throw on faulty access token', () => {
    expect(() => resourceAccess('faulty')).toThrow();
  });

  it('should return null on access token without resource_access', () => {
    expect(resourceAccess(accessTokenWithoutResourceAccess)).toBeNull();
  });

  it('should return null on access token with empty resource_access', () => {
    expect(resourceAccess(accessTokenWithEmptyResourceAccess)).toBeNull();
  });

  it('should parse resouce_access with valid access token', () => {
    const data = resourceAccess(accessTokenWithResourceAccess);
    expect(data).toEqual({
      'example-client': {
        roles: ['service-owner', 'test1'],
      },
      account: {
        roles: ['view-profile'],
      },
    });
  });

  it('should parse resouce_access with valid access token but including a special char', () => {
    const data = resourceAccess(accessTokenWithSpecialCharAndResourceAccess);
    expect(data).toEqual({
      'example-client': {
        roles: ['service-ownerï', 'test1'],
      },
      account: {
        roles: ['view-profile'],
      },
    });
  });
});
