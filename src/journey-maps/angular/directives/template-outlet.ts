import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { SbbTemplateType } from '../journey-maps.interfaces';

@Directive({
  selector: '[sbbTemplateOutlet]',
  standalone: false,
})
export class SbbTemplateOutlet implements OnChanges {
  // NG Template
  private _viewRef?: EmbeddedViewRef<any>;
  // HTML Template
  private _htmlContent?: HTMLElement;
  private _htmlTemplateObserver: MutationObserver;

  @Input() public sbbTemplateOutlet?: SbbTemplateType;
  @Input() public sbbTemplateOutletContext?: Object;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.sbbTemplateOutlet) {
      this._removeOldTemplate();

      if (typeof this.sbbTemplateOutlet === 'string') {
        this._setupHtmlTemplate(this.sbbTemplateOutlet);
      } else if (this.sbbTemplateOutlet) {
        this._setupNgTemplate(this.sbbTemplateOutlet);
      }
    } else if (this._viewRef && changes.sbbTemplateOutletContext?.currentValue) {
      this._viewRef.context = this.sbbTemplateOutletContext;
    }
  }

  private get _nativeElement(): HTMLElement | undefined {
    return this._viewContainerRef?.element.nativeElement;
  }

  private _setupNgTemplate(template: TemplateRef<any>) {
    this._viewRef = this._viewContainerRef.createEmbeddedView(
      template,
      this.sbbTemplateOutletContext,
    );
  }

  private _setupHtmlTemplate(id: string) {
    const content = (this._document.getElementById(id) as HTMLTemplateElement).content;
    const attachHtmlTemplate = () => {
      this._htmlContent = content.cloneNode(true) as HTMLElement;
      this._nativeElement?.replaceChildren(this._htmlContent);
    };
    attachHtmlTemplate();

    this._htmlTemplateObserver = new MutationObserver(attachHtmlTemplate);
    this._htmlTemplateObserver.observe(content, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private _removeOldTemplate() {
    if (this._viewRef) {
      this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
      this._viewRef = undefined;
    }

    if (this._htmlContent) {
      this._nativeElement?.replaceChildren();
      this._htmlContent = undefined;
    }

    this._htmlTemplateObserver?.disconnect();
  }
}
