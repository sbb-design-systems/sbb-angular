import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { KeycloakRoutingModule } from './keycloak-routing.module';
import { KeycloakComponent } from './keycloak/keycloak.component';

@NgModule({
  declarations: [KeycloakComponent],
  imports: [CommonModule, KeycloakRoutingModule]
})
export class KeycloakModule {}
