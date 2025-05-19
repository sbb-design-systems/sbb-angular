import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ChangeDetectorRef,
  Directive,
  inject,
  InjectionToken,
  Injector,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Injection token that can be used to reference instances of `SbbMenuContent`. It serves
 * as alternative token to the actual `SbbMenuContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_MENU_CONTENT = new InjectionToken<SbbMenuContent>('SbbMenuContent');

/**
 * Menu content that will be rendered lazily once the menu is opened.
 */
@Directive({
  selector: 'ng-template[sbbMenuContent]',
  providers: [{ provide: SBB_MENU_CONTENT, useExisting: SbbMenuContent }],
})
export class SbbMenuContent implements OnDestroy {
  private _template = inject<TemplateRef<any>>(TemplateRef);
  private _appRef = inject(ApplicationRef);
  private _injector = inject(Injector);
  private _viewContainerRef = inject(ViewContainerRef);
  private _document = inject(DOCUMENT);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _portal: TemplatePortal | undefined;
  private _outlet: DomPortalOutlet | undefined;

  /** Emits when the menu content has been attached. */
  readonly _attached: Subject<void> = new Subject<void>();

  constructor(...args: unknown[]);
  constructor() {}

  /**
   * Attaches the content with a particular context.
   * @docs-private
   */
  attach(context: any = {}) {
    if (!this._portal) {
      this._portal = new TemplatePortal(this._template, this._viewContainerRef);
    }

    this.detach();

    if (!this._outlet) {
      this._outlet = new DomPortalOutlet(
        this._document.createElement('div'),
        this._appRef,
        this._injector,
      );
    }

    const element: HTMLElement = this._template.elementRef.nativeElement;

    // Because we support opening the same menu from different triggers (which in turn have their
    // own `OverlayRef` panel), we have to re-insert the host element every time, otherwise we
    // risk it staying attached to a pane that's no longer in the DOM.
    element.parentNode!.insertBefore(this._outlet.outletElement, element);

    // When `SbbMenuContent` is used in an `OnPush` component, the insertion of the menu
    // content via `createEmbeddedView` does not cause the content to be seen as "dirty"
    // by Angular. This causes the `@ContentChildren` for menu items within the menu to
    // not be updated by Angular. By explicitly marking for check here, we tell Angular that
    // it needs to check for new menu items and update the `@ContentChild` in `SbbMenu`.
    this._changeDetectorRef.markForCheck();

    this._portal.attach(this._outlet, context);
    this._attached.next();
  }

  /**
   * Detaches the content.
   * @docs-private
   */
  detach() {
    if (this._portal?.isAttached) {
      this._portal.detach();
    }
  }

  ngOnDestroy() {
    this.detach();
    this._outlet?.dispose();
  }
}
