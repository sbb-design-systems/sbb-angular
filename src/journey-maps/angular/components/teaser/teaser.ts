import { animate, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { SbbTemplateType } from '../../journey-maps.interfaces';
import { SbbLocaleService } from '../../services/locale-service';

@Component({
  selector: 'sbb-teaser',
  templateUrl: './teaser.html',
  styleUrls: ['./teaser.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('500ms', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [animate('500ms', style({ transform: 'translateX(-100%)' }))]),
    ]),
  ],
  standalone: false,
})
export class SbbTeaser implements OnInit, OnChanges {
  @Input() rendered: boolean;
  @Input() templateContext: any;
  @Input() template: SbbTemplateType;
  @Input() withPaginator: boolean = false;
  @Input() isDarkMode: boolean;

  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseEvent: EventEmitter<'enter' | 'leave'> = new EventEmitter<'enter' | 'leave'>();

  closeLabel: string;

  templateContextIndex: number = 0;
  templateContextSize: number = 1;

  private _mouseEnter = () => this.mouseEvent.next('enter');
  private _mouseLeave = () => this.mouseEvent.next('leave');

  @ViewChild('container') set container(container: ElementRef<HTMLElement>) {
    const nativeElement = container?.nativeElement;
    if (nativeElement) {
      nativeElement.removeEventListener('mouseenter', this._mouseEnter);
      nativeElement.removeEventListener('mouseleave', this._mouseLeave);
      nativeElement.addEventListener('mouseenter', this._mouseEnter);
      nativeElement.addEventListener('mouseleave', this._mouseLeave);
    }
  }

  constructor(private _i18n: SbbLocaleService) {}

  ngOnInit(): void {
    this.closeLabel = this._i18n.getText('close');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['templateContext']?.currentValue) {
      this.templateContextIndex = 0;
      this.templateContextSize = Array.isArray(this.templateContext)
        ? this.templateContext.length
        : 1;
    }
  }

  getTemplateContext(): any {
    const paginated = Array.isArray(this.templateContext) && this.withPaginator;
    const ctx = paginated ? this.templateContext[this.templateContextIndex] : this.templateContext;
    return {
      $implicit: ctx ?? {},
    };
  }

  onIndexSelected(index: number) {
    this.templateContextIndex = index;
  }

  showPaginator() {
    return this.withPaginator && this.templateContextSize > 1 && typeof this.template !== 'string';
  }
}
