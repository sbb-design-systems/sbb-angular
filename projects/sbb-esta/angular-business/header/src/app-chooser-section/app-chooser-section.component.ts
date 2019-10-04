import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-app-chooser-section',
  templateUrl: './app-chooser-section.component.html',
  styleUrls: ['./app-chooser-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppChooserSectionComponent {
  @Input() label: string;
}
