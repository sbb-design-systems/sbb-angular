/** The issuer URL for SBB SSO production environment. */
export const SBB_SSO_ISSUER_URL = 'https://sso.sbb.ch/auth/realms/SBB_Public';
/**
 * DO NOT USE THIS FOR PRODUCTION.
 * The issuer URL for SBB SSO integration environment.
 */
export const SBB_SSO_INT_ISSUER_URL = 'https://sso-int.sbb.ch/auth/realms/SBB_Public';

/** The IDP hint for SBB SSO for Swisspass production environment. */
export const SBB_SSO_IDP_AZURE_AD = 'azure_sbb_prod';
/**
 * DO NOT USE THIS FOR PRODUCTION.
 * The IDP hint for SBB SSO for Swisspass integration environment.
 */
export const SBB_SSO_IDP_AZURE_AD_TEST = 'azure_sbb_test';
/** The IDP hint for SBB SSO for Swisspass production environment. */
export const SBB_SSO_IDP_SWISSPASS = 'swisspass_prod';
/**
 * DO NOT USE THIS FOR PRODUCTION.
 * The IDP hint for SBB SSO for Swisspass integration environment.
 */
export const SBB_SSO_IDP_SWISSPASS_INT = 'swisspass_int';
/**
 * DO NOT USE THIS FOR PRODUCTION.
 * The IDP hint for SBB SSO for Swisspass test environment.
 */
export const SBB_SSO_IDP_SWISSPASS_TEST = 'swisspass_test';
/** The IDP hint for SBB SSO for Google. */
export const SBB_SSO_IDP_GOOGLE = 'google';
/** The IDP hint for SBB SSO for Microsoft. */
export const SBB_SSO_IDP_MICROSOFT = 'microsoft';
/** The IDP hint for SBB SSO for GitHub. */
export const SBB_SSO_IDP_GITHUB = 'github';

/**
 * IDP hint for SBB Azure AD.
 * Can be used for the customQueryParams configuration for angular-oauth2-oidc.
 */
export const SBB_SSO_IDP_HINT_AZURE_AD = { kc_idp_hint: SBB_SSO_IDP_AZURE_AD };
