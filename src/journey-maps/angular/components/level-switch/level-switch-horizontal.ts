import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbLocaleService } from '../../services/locale-service';

import { SbbLevelSwitcher } from './services/level-switcher';

// stackblitz: https://stackblitz.com/edit/web-platform-dt3pcc
@Component({
  selector: 'sbb-level-switch-horizontal',
  templateUrl: './level-switch-horizontal.html',
  styleUrls: ['./level-switch-horizontal.css'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(150)]),
      transition(':leave', animate(150, style({ opacity: 0 }))),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbLevelSwitchHorizontal implements OnDestroy {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  @ViewChild('mainButton') mainButton: ElementRef<HTMLButtonElement>;
  @ViewChildren('sideButton') sideButtons: QueryList<ElementRef<HTMLButtonElement>>;
  showSideButtons: boolean = false;
  private countdownTimer: ReturnType<typeof setTimeout>;
  private autoCollapseTimeout = 5000; // 5 seconds

  private _destroyed = new Subject<void>();

  constructor(
    private _ref: ChangeDetectorRef,
    private _i18n: SbbLocaleService,
    private _levelSwitchService: SbbLevelSwitcher,
  ) {
    this._levelSwitchService.changeDetectionEmitter
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._ref.detectChanges());
  }

  toggleSideButtons(): void {
    this.showSideButtons = !this.showSideButtons;
    if (this.showSideButtons) {
      this.startCountdown();
      setTimeout(() => {
        this.focusMatchingButton();
      }, 0); // make sure side buttons are visible first
    } else {
      clearTimeout(this.countdownTimer);
    }
  }

  private focusMatchingButton(): void {
    const mainButtonText = this.mainButton.nativeElement.textContent;
    const matchingButton = this.sideButtons.find(
      (button) => button.nativeElement.textContent === mainButtonText,
    );
    matchingButton?.nativeElement.focus();
  }

  private startCountdown(): void {
    clearTimeout(this.countdownTimer);
    this.countdownTimer = setTimeout(() => {
      this.toggleSideButtons();
      this._ref.detectChanges();
    }, this.autoCollapseTimeout);
  }

  get selectedLevel(): number | undefined {
    return this._levelSwitchService.selectedLevel;
  }

  get visibleLevels(): number[] {
    return this._levelSwitchService.visibleLevels;
  }

  onSideButtonClick(level: number | undefined): void {
    this.toggleSideButtons();
    this.mainButton.nativeElement.focus();
    this._levelSwitchService.switchLevel(this.selectedLevel === level ? undefined : level);
  }

  getLevelLabel(level: number, selectedLevel: number | undefined): string {
    const txt1 = this._i18n.getText('a4a.visualFunction');
    const txt2 =
      level === selectedLevel
        ? this._i18n.getTextWithParams('a4a.unselectFloor', level)
        : this._i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  onMainButtonEnter(event: Event): void {
    event.preventDefault();
    this.toggleSideButtons();
  }

  onSideButtonEnter(level: number, event: any) {
    event.preventDefault();
    this.onSideButtonClick(level);
  }
}
