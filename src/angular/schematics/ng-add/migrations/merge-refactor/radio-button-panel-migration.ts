import { CheckboxPanelMigration } from './checkbox-panel-migration';

/**
 * Migration that updates sbb-radio-button-panel usages to the new format.
 */
export class RadioButtonPanelMigration extends CheckboxPanelMigration {
  protected _type = 'sbb-radio-button-panel';
}
