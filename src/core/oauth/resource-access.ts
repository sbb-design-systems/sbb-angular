declare class Buffer {
  static from(value: string, encoding: string): { toString(encoding: string): string };
}

const base64Decode =
  typeof atob === 'function' ? atob : (s: string) => Buffer.from(s, 'base64').toString('binary');

/**
 * Retrieve the resource access information from the access token from SBB SSO.
 * This can either be used by directly providing the access token as a string
 * or by providing the OAuthService from angular-oauth2-oidc.
 */
export function resourceAccess(
  accessToken: string | { getAccessToken(): string }
): null | { [resource: string]: { roles: string[] } } {
  accessToken =
    !accessToken || typeof accessToken === 'string' ? accessToken : accessToken.getAccessToken();
  if (!accessToken || typeof accessToken !== 'string') {
    return null;
  }

  const payload = base64Decode(accessToken.split('.')[1]);
  const parsedAccessToken = JSON.parse(payload);
  if (!('resource_access' in parsedAccessToken) || !parsedAccessToken.resource_access) {
    return null;
  }

  return parsedAccessToken.resource_access;
}
