import { TemplateRef } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

export interface SbbMenuTriggerContext {
  triggerWidth: number;
  templateContent?: TemplateRef<any>;
  elementContent?: SafeHtml;
}
