import {
  Component, ChangeDetectionStrategy, ContentChild, AfterContentInit, TemplateRef, ViewChild, ElementRef, HostListener, Input, HostBinding, ChangeDetectorRef
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
export class GhettoboxComponent implements AfterContentInit {

  @Input() @HostBinding('attr.id')
  ghettoboxId = `sbb-ghettobox-${counter++}`;

  @HostBinding('attr.role') role = 'alert';

  @ViewChild('defaultIcon') iconDefault: TemplateRef<any>;
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
  private _icon: TemplateRef<any>;

  private _ghettobox: Ghettobox;
  get ghettobox() {
    return this._ghettobox;
  }
  set ghettobox(value: Ghettobox) {
    this._ghettobox = value;
    this._changeDetector.markForCheck();
  }

  @ContentChild(GhettoboxLinkDirective, { read: ElementRef }) ghettoboxLink: ElementRef<any>;

  @HostListener('click')
  click() {
    if (this.ghettoboxLink) {
      this.ghettoboxLink.nativeElement.click();
    }
    if (this.ghettobox && this.ghettobox.link) {
      if (Array.isArray(this.ghettobox.link.routerLink)) {
        this.router.navigate(this.ghettobox.link.routerLink, this.ghettobox.link);
      } else {
        this.router.navigateByUrl(this.ghettobox.link.routerLink, this.ghettobox.link);
      }
    }
  }

  constructor(private _changeDetector: ChangeDetectorRef,
    private router: Router) {
  }

  deleteGhettobox(evt: any) {
    evt.stopPropagation();
    console.log('DELETE');
  }

  ngAfterContentInit() {
  }

}
