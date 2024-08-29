import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
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
export class SbbLevelSwitchHorizontal implements OnInit, OnDestroy {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;
  @Input() isDarkMode: boolean;

  @ViewChild('mainButton') mainButton: ElementRef<HTMLButtonElement>;
  @ViewChildren('sideButton') sideButtons: QueryList<ElementRef<HTMLButtonElement>>;

  showSideButtons: boolean = false;
  levelSwitchLabel: string;

  private _countdownTimer: ReturnType<typeof setTimeout>;
  private _autoCollapseTimeout = 5000; // 5000 ms
  private _destroyed = new Subject<void>();

  constructor(
    private _cd: ChangeDetectorRef,
    private _i18n: SbbLocaleService,
    private _levelSwitchService: SbbLevelSwitcher,
  ) {
    this._levelSwitchService.changeDetectionEmitter
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._cd.detectChanges());
  }

  ngOnInit(): void {
    this.levelSwitchLabel = `${this._i18n.getText('a4a.visualFunction')} ${this._i18n.getText(
      'a4a.levelSwitch',
    )}`;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  toggleSideButtons(): void {
    if (!this.showSideButtons) {
      this._openSideButton();
    } else {
      this._closeSideButton();
    }
  }

  private _openSideButton(): void {
    this._doShowSideButtons(true);
    this.startCountdown();
    setTimeout(() => {
      this._focusMatchingButton();
    }, 250); // make sure side buttons are visible first
  }

  private _closeSideButton(): void {
    this._doShowSideButtons(false);
    this.cancelCountdown();
  }

  private _doShowSideButtons(showSideButtons: boolean) {
    this.showSideButtons = showSideButtons;
    this._cd.detectChanges();
  }

  private _focusMatchingButton(): void {
    const mainButtonText = this.mainButton.nativeElement.textContent;
    const matchingButton = this.sideButtons.find(
      (button) => button.nativeElement.textContent?.trim() === mainButtonText?.trim(),
    );
    matchingButton?.nativeElement.focus();
  }

  cancelCountdown(): void {
    clearTimeout(this._countdownTimer);
  }

  onSideButtonsLeave(): void {
    // blur / mouseout can happen while side buttons remain open
    // or because they were closed by clicking on one of them
    if (this.showSideButtons) {
      this.startCountdown(); // if side buttons remain open
    } else {
      this.cancelCountdown(); // if side buttons are closed
    }
  }

  startCountdown(): void {
    clearTimeout(this._countdownTimer);
    this._countdownTimer = setTimeout(() => {
      this._closeSideButton(); // when the countdown finishes, we always want to close
      this._cd.detectChanges();
    }, this._autoCollapseTimeout);
  }

  get selectedLevel(): number | undefined {
    return this._levelSwitchService.selectedLevel;
  }

  get visibleLevels(): number[] {
    return this._levelSwitchService.visibleLevels;
  }

  onSideButtonClick(level: number | undefined): void {
    this._closeSideButton(); // when the side button is clicked, we always want to close
    this.mainButton.nativeElement.focus();
    this._levelSwitchService.switchLevel(this.selectedLevel === level ? undefined : level);
  }

  getLevelLabel(level: number, selectedLevel: number | undefined): string {
    return level === selectedLevel
      ? this._i18n.getTextWithParams('a4a.unselectFloor', level)
      : this._i18n.getTextWithParams('a4a.selectFloor', level);
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
