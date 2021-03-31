import { TemplatePortal } from '@angular/cdk/portal';
import { SafeHtml } from '@angular/platform-browser';

export interface SbbMenuTriggerContext {
  triggerWidth: number;
  contentPortal?: TemplatePortal;
  elementContent?: SafeHtml;
}
