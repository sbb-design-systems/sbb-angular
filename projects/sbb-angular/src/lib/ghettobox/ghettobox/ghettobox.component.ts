import {
  Component,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  HostBinding,
  ChangeDetectorRef
} from '@angular/core';
import { GhettoboxIconDirective, GhettoboxLinkDirective } from './ghettobox-content.directives';
import { Ghettobox } from './ghettobox-ref';
import { Router } from '@angular/router';

let counter = 0;

@Component({
  selector: 'sbb-ghettobox',
  templateUrl: './ghettobox.component.html',
  styleUrls: ['./ghettobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhettoboxComponent {

  visible = true;

  @Input() @HostBinding('attr.id')
  ghettoboxId = `sbb-ghettobox-${counter++}`;

  @HostBinding('attr.role') role = 'alert';

  @HostBinding('attr.aria-hidden') ariaHidden = 'false';

  @ViewChild('defaultIcon') iconDefault: TemplateRef<any>;

  private _icon: TemplateRef<any>;
  @ContentChild(GhettoboxIconDirective, { read: TemplateRef })
  set icon(value: TemplateRef<any>) {
    this._icon = value;
  }
  get icon(): TemplateRef<any> {
    if (!this._icon) {
      return this.iconDefault;
    }
    return this._icon;
  }

  private _ghettobox: Ghettobox;
  get ghettobox() {
    return this._ghettobox;
  }
  set ghettobox(value: Ghettobox) {
    this._ghettobox = value;
    this._changeDetector.markForCheck();
  }

  @ContentChild(GhettoboxLinkDirective, { read: ElementRef })
  ghettoboxLink: ElementRef<any>;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private router: Router) {
  }

  @HostListener('click')
  click() {
    if (this.ghettoboxLink) {
      this.ghettoboxLink.nativeElement.click();
    }
    if (this.ghettobox && this.ghettobox.link) {
      this.clickGhettoboxLinkFromService();
    }
  }

  delete(evt: any): void {
    evt.stopPropagation();
    this.destroy();
  }

  destroy(): void {
    this.visible = false;
    this.role = undefined;
    this.ariaHidden = 'true';
  }

  private clickGhettoboxLinkFromService(): void {
    if (Array.isArray(this.ghettobox.link.routerLink)) {
      this.router.navigate(this.ghettobox.link.routerLink, this.ghettobox.link);
    } else {
      this.router.navigateByUrl(this.ghettobox.link.routerLink, this.ghettobox.link);
    }
  }

}
