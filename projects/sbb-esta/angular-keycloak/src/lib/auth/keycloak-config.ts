export interface KeycloakConfig {
  url?: string;
  realm?: string;
  clientId?: string;
  /**
   * @deprecated This is not used internally. Use the loginOptions parameter instead on AuthModule.forRoot.
   */
  idpHint?: string;
}
