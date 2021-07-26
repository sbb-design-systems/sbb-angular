import { DevkitContext, Migration, ResolvedResource, TargetVersion } from '@angular/cdk/schematics';

import { iterateNodes } from '../../utils';

import { BadgeMigration } from './merge-refactor/badge-migration';
import { ButtonMigration } from './merge-refactor/button-migration';
import { CheckboxPanelMigration } from './merge-refactor/checkbox-panel-migration';
import { ChipsMigration } from './merge-refactor/chips-migration';
import { FormFieldMigration } from './merge-refactor/form-field-migration';
import { LinkMigration } from './merge-refactor/link-migration';
import { PaginationMigration } from './merge-refactor/pagination-migration';
import { ProcessflowMigration } from './merge-refactor/processflow-migration';
import { RadioButtonPanelMigration } from './merge-refactor/radio-button-panel-migration';
import { RefactorMigration } from './merge-refactor/refactor-migration';
import { SearchMigration } from './merge-refactor/search-migration';
import { TabsMigration } from './merge-refactor/tabs-migration';
import { TagMigration } from './merge-refactor/tag-migration';

/**
 * Migration that applies all required changes from the merge refactoring.
 */
export class MergeRefactorMigration extends Migration<null, DevkitContext> {
  enabled: boolean = this.targetVersion === ('merge' as TargetVersion);

  private _refactorMigrations: RefactorMigration[] = [
    new BadgeMigration(this),
    new ButtonMigration(this),
    new CheckboxPanelMigration(this),
    new ChipsMigration(this),
    new FormFieldMigration(this),
    new LinkMigration(this),
    new PaginationMigration(this),
    new ProcessflowMigration(this),
    new RadioButtonPanelMigration(this),
    new SearchMigration(this),
    new TabsMigration(this),
    new TagMigration(this),
  ];

  /** Method that will be called for each Angular template in the program. */
  visitTemplate(template: ResolvedResource): void {
    iterateNodes(template.content, (node) =>
      this._refactorMigrations.forEach((m) => m.checkMigratable(template, node))
    );
  }

  postAnalysis() {
    this._refactorMigrations.forEach((m) => m.applyMigration());
  }
}
