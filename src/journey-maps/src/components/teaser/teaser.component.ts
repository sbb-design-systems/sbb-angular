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
  TemplateRef,
  ViewChild
} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {LocaleService} from '../../services/locale.service';

@Component({
  selector: 'rokas-teaser',
  templateUrl: './teaser.component.html',
  styleUrls: ['./teaser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('showHideTrigger', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('500ms', style({transform: 'translateX(0%)'})),
      ]),
      transition(':leave', [
        animate('500ms', style({transform: 'translateX(-100%)'}))
      ])
    ]),
  ]
})
export class TeaserComponent implements OnInit, OnChanges {

  @Input() rendered: boolean;
  @Input() templateContext: any;
  @Input() template: TemplateRef<any>;
  @Input() withPaginator = false;
  @Output() closeClicked = new EventEmitter<void>();
  @Output() mouseEvent = new EventEmitter<'enter' | 'leave'>();

  closeLabel: string;

  private templateContextIndex = 0;
  private templateContextSize = 1;

  private mouseEnter = () => this.mouseEvent.next('enter');
  private mouseLeave = () => this.mouseEvent.next('leave');

  @ViewChild('container') set container(container: ElementRef<HTMLElement>) {
    const nativeElement = container?.nativeElement;
    if (nativeElement) {
      nativeElement.removeEventListener('mouseenter', this.mouseEnter);
      nativeElement.removeEventListener('mouseleave', this.mouseLeave);
      nativeElement.addEventListener('mouseenter', this.mouseEnter);
      nativeElement.addEventListener('mouseleave', this.mouseLeave);
    }
  }

  constructor(private i18n: LocaleService) {
  }

  ngOnInit(): void {
    this.closeLabel = this.i18n.getText('close');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.templateContext?.currentValue) {
      this.templateContextIndex = 0;
      this.templateContextSize = Array.isArray(this.templateContext) ? this.templateContext.length : 1;
    }
  }

  getTemplateContext(): any {
    const paginated = Array.isArray(this.templateContext) && this.withPaginator;
    const ctx = paginated ? this.templateContext[this.templateContextIndex] : this.templateContext;
    return {
      $implicit: ctx ?? {}
    };
  }

  onIndexSelected(index: number) {
    this.templateContextIndex = index;
  }
}
