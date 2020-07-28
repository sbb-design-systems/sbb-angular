import { NgModule } from '@angular/core';

import { IconCurriculumVitaeModule } from './icon-curriculum-vitae.module';
import { IconHandGraduationCapModule } from './icon-hand-graduation-cap.module';
import { IconShipSteeringWheelModule } from './icon-ship-steering-wheel.module';

const modules = [
  IconCurriculumVitaeModule,
  IconHandGraduationCapModule,
  IconShipSteeringWheelModule,
];

/**
 * @Deprecated use @sbb-esta/angular-core/icon module
 */
@NgModule({
  imports: modules,
  exports: modules,
})
export class IconCollectionCareerModule {}
