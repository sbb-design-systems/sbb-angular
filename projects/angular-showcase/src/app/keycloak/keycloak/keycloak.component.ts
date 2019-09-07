import { Component } from '@angular/core';

import { HtmlLoader } from '../../shared/html-loader.service';

@Component({
  selector: 'sbb-keycloak',
  templateUrl: './keycloak.component.html',
  styleUrls: ['./keycloak.component.scss'],
  providers: [HtmlLoader]
})
export class KeycloakComponent {}
