import { Directive, HostBinding, Optional, ComponentRef,
   ElementRef, ViewContainerRef, HostListener, TemplateRef, Host, Self, ViewRef } from '@angular/core';
import { GhettoboxRef } from './ghettobox-ref';
import { GhettoboxComponent } from './ghettobox.component';

@Directive({ selector: '[sbbGhettoboxIcon]' })
export class GhettoboxIconDirective {
}

@Directive({ selector: 'a[sbbGhettoboxLink]' })
export class GhettoboxLinkDirective {
}

