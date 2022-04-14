import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { SbbTemplateType } from '../../journey-maps.interfaces';

@Component({
  selector: 'sbb-template-renderer',
  templateUrl: './template-renderer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbTemplateRenderer implements OnChanges {
  @Input() templateContext: any;
  @Input() template?: SbbTemplateType;

  ngTemplate?: TemplateRef<any>;
  htmlTemplate?: HTMLElement;

  private _htmlTemplateContainer?: ElementRef<HTMLElement>;
  private _htmlTemplateObserver: MutationObserver;

  @ViewChild('htmlTemplateContainer') set htmlTemplateContainer(
    container: ElementRef<HTMLElement>
  ) {
    this._htmlTemplateContainer = container;
    this.addHtmlTemplateToDOM();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.template) {
      return;
    }

    this._htmlTemplateObserver?.disconnect();

    if (typeof this.template === 'string') {
      this.ngTemplate = undefined;
      const content = (document.getElementById(this.template) as HTMLTemplateElement).content;
      const setupHtmlTemplate = () => {
        this.htmlTemplate = content.cloneNode(true) as HTMLElement;
        this.addHtmlTemplateToDOM();
      };

      setupHtmlTemplate();
      this._htmlTemplateObserver = new MutationObserver(setupHtmlTemplate);
      this._htmlTemplateObserver.observe(content, {
        subtree: true,
        childList: true,
      });
    } else {
      this.htmlTemplate = undefined;
      this.ngTemplate = this.template;
    }
  }

  addHtmlTemplateToDOM() {
    if (this.htmlTemplate) {
      this._htmlTemplateContainer?.nativeElement?.replaceChildren(this.htmlTemplate);
    }
  }
}
