import { SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createTestCaseSetup } from '@sbb-esta/angular/schematics/testing';

/** Path to the schematic collection that includes the migrations. */
export const collection = require.resolve('../../collection.json');

describe('i18n import migration', () => {
  let tree: UnitTestTree;
  let runMigration: () => Promise<{ logOutput: string }>;

  beforeEach(async () => {
    const testSetup = await createTestCaseSetup('ng-add-migrate', collection, []);
    tree = testSetup.appTree;
    runMigration = testSetup.runFixers;

    const angularJson = readJsonFile('/angular.json');
    angularJson.projects['cdk-testing'].i18n = {};
    angularJson.projects['cdk-testing'].i18n.locales = {};
    angularJson.projects['cdk-testing'].i18n.locales['de-CH'] = {};
    angularJson.projects['cdk-testing'].i18n.locales['de-CH'].translation = [
      'src/locales/messages.de-CH.xlf',
      'node_modules/@sbb-esta/angular-core/i18n/xlf2/messages.de-CH.xlf',
    ];

    angularJson.projects['cdk-testing'].i18n.locales['fr-CH'] = {};
    angularJson.projects['cdk-testing'].i18n.locales['fr-CH'].translation =
      'node_modules/@sbb-esta/angular-core/i18n/xlf2/messages.fr-CH.xlf';

    angularJson.projects['cdk-testing'].i18n.locales['it-CH'] =
      'node_modules/@sbb-esta/angular-core/i18n/xlf2/messages.it-CH.xlf';

    angularJson.projects['cdk-testing'].i18n.locales['en-CH'] = [
      'src/locales/messages.en-CH.xlf',
      'node_modules/@sbb-esta/angular-core/i18n/xlf2/messages.en-CH.xlf',
    ];

    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    tree.create('src/locales/messages.de-CH.xlf', messageFileContent);
    tree.create('src/locales/messages.en-CH.xlf', messageFileContent);

    // Update main.ts with i18n import
    const mainTs = tree.read('projects/cdk-testing/src/main.ts')!.toString('utf-8');
    tree.overwrite(
      'projects/cdk-testing/src/main.ts',
      `import '@sbb-esta/angular-core/i18n';\n${mainTs}`
    );
  });

  /** Assert that file exists and parse json file to object */
  function readJsonFile(path: string) {
    if (!tree.exists(path)) {
      throw new SchematicsException(path + ' not found');
    }
    return JSON.parse(tree.read(path)!.toString('utf-8')) as any;
  }

  it('should migrate angular i18n imports in angular.json to angular', async () => {
    await runMigration();

    const modifiedAngularJson = readJsonFile('/angular.json');

    expect(modifiedAngularJson.projects['cdk-testing'].i18n.locales['de-CH'].translation[1]).toBe(
      'node_modules/@sbb-esta/angular/i18n/xlf2/messages.de-CH.xlf'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].i18n.locales['fr-CH'].translation).toBe(
      'node_modules/@sbb-esta/angular/i18n/xlf2/messages.fr-CH.xlf'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].i18n.locales['it-CH']).toBe(
      'node_modules/@sbb-esta/angular/i18n/xlf2/messages.it-CH.xlf'
    );
    expect(modifiedAngularJson.projects['cdk-testing'].i18n.locales['en-CH'][1]).toBe(
      'node_modules/@sbb-esta/angular/i18n/xlf2/messages.en-CH.xlf'
    );
  });

  it('should migrate sbbGhettoboxCloseGhettobox to sbbAlertCloseAlert in array entries', async () => {
    await runMigration();

    const messagesContent = tree.read('/src/locales/messages.de-CH.xlf')!.toString('utf-8');
    const messagesContent2 = tree.read('/src/locales/messages.en-CH.xlf')!.toString('utf-8');

    [messagesContent, messagesContent2].forEach((content) => {
      expect(content).not.toContain('sbbGhettoboxCloseGhettobox');
      expect(content).toContain('sbbAlertCloseAlert');
    });
  });

  it('should migrate sbbGhettoboxCloseGhettobox to sbbAlertCloseAlert in string entries', async () => {
    const angularJson = readJsonFile('/angular.json');

    angularJson.projects['cdk-testing'].i18n.locales['de-CH'].translation =
      '/src/locales/messages.de-CH.xlf';

    angularJson.projects['cdk-testing'].i18n.locales['en-CH'] = '/src/locales/messages.en-CH.xlf';

    tree.overwrite('/angular.json', JSON.stringify(angularJson, null, 2));

    await runMigration();

    const messagesContent = tree.read('/src/locales/messages.de-CH.xlf')!.toString('utf-8');
    const messagesContent2 = tree.read('/src/locales/messages.en-CH.xlf')!.toString('utf-8');

    [messagesContent, messagesContent2].forEach((content) => {
      expect(content).not.toContain('sbbGhettoboxCloseGhettobox');
      expect(content).toContain('sbbAlertCloseAlert');
    });
  });

  it('should migrate @sbb-esta/angular-core/i18n import in main.ts', async () => {
    let mainTs = tree.read('projects/cdk-testing/src/main.ts')!.toString('utf-8');
    expect(mainTs).toContain('@sbb-esta/angular-core/i18n');

    await runMigration();

    mainTs = tree.read('projects/cdk-testing/src/main.ts')!.toString('utf-8');
    expect(mainTs).toContain('@sbb-esta/angular/i18n');
  });
});

const messageFileContent = `<?xml version="1.0" encoding="UTF-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
    <file source-language="en-CH" datatype="plaintext" original="ng2.template" target-language="de-CH">
        <body><trans-unit id="sbbGhettoboxCloseGhettobox" datatype="html">
            <source>Hinweismeldung schliessen</source><target state="final">Hinweismeldung schliessen</target>
            <context-group purpose="location">
                <context context-type="sourcefile">node_modules/@sbb-esta/angular-public/lib/ghettobox/ghettobox/ghettobox.component.d.ts</context>
                <context context-type="linenumber">44</context>
            </context-group>
            <note priority="1" from="description">Hidden button label to close the ghettobox</note>
        </trans-unit>
        </body>
    </file>
</xliff>`;
