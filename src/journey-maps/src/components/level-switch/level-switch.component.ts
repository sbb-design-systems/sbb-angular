import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {Map as MaplibreMap} from 'maplibre-gl';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LocaleService} from '../../services/locale.service';
import {LevelSwitchService} from './services/level-switch.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(150)
      ]),
      transition(':leave',
        animate(150, style({opacity: 0})))
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSwitchComponent implements OnDestroy {

  @Input() map: MaplibreMap;
  @Input() showSmallButtons: boolean;

  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef,
              private i18n: LocaleService,
              private levelSwitchService: LevelSwitchService,
  ) {
    this.levelSwitchService.changeDetectionEmitter.pipe(
      takeUntil(this.destroyed)
    ).subscribe(
      () => this.ref.detectChanges()
    );
  }

  get selectedLevel(): number {
    return this.levelSwitchService.selectedLevel;
  }

  get visibleLevels(): number[] {
    return this.levelSwitchService.visibleLevels;
  }

  switchLevel(level: number): void {
    this.levelSwitchService.switchLevel(level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this.i18n.getText('a4a.visualFunction');
    const txt2 = this.i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
