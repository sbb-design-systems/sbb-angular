import {
  Component, ChangeDetectionStrategy, ContentChild, AfterContentInit, TemplateRef, ViewChild, ElementRef, HostListener
} from '@angular/core';
import { GhettoboxIconDirective, GhettoboxLinkDirective } from './ghettobox-content.directives';

@Component({
  selector: 'sbb-ghettobox',
  templateUrl: './ghettobox.component.html',
  styleUrls: ['./ghettobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhettoboxComponent implements AfterContentInit {

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

  @ContentChild(GhettoboxLinkDirective, { read: ElementRef }) ghettoboxLink: ElementRef<any>;
  @HostListener('click', ['$event'])
  click(evt: any) {
    if (this.ghettoboxLink) {
      this.ghettoboxLink.nativeElement.click();
    }
  }

  constructor() { }

  deleteGhettobox(evt: any) {
    evt.stopPropagation();
    console.log('DELETE');
  }

  ngAfterContentInit() {
  }

}
