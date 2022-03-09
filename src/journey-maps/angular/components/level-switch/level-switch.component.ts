import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Map as MaplibreMap } from 'maplibre-gl';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocaleService } from '../../services/locale.service';

import { LevelSwitchService } from './services/level-switch.service';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.css'],
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
export class LevelSwitchComponent implements OnDestroy {
  @Input() map: MaplibreMap | null;
  @Input() showSmallButtons: boolean | undefined;

  private _destroyed = new Subject<void>();

  constructor(
    private _ref: ChangeDetectorRef,
    private _i18n: LocaleService,
    private _levelSwitchService: LevelSwitchService
  ) {
    this._levelSwitchService.changeDetectionEmitter
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._ref.detectChanges());
  }

  get selectedLevel(): number {
    return this._levelSwitchService.selectedLevel;
  }

  get visibleLevels(): number[] {
    return this._levelSwitchService.visibleLevels;
  }

  switchLevel(level: number): void {
    this._levelSwitchService.switchLevel(level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this._i18n.getText('a4a.visualFunction');
    const txt2 = this._i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
