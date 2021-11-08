import { writeFileSync } from 'fs';

const ignore = ['core', 'i18n', 'oauth'];

if (require.main === module) {
  const [targetPath, ...modules] = process.argv.slice(2);
  const filteredModules = modules.filter((module) => !ignore.includes(module));
  const template = `import { NgModule } from '@angular/core';
${filteredModules.map((m) => `import { ${toModuleName(m)} } from '{packageName}/${m}';`).join('\n')}

const modules = [
  SbbIconModule,
  ${filteredModules.map(toModuleName).join(',\n  ')},
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SbbModule {}
`;
  writeFileSync(targetPath, template, 'utf8');
}

function toModuleName(moduleName: string) {
  return `Sbb${moduleName.replace(/(^\w|-\w)/g, (m) => m.replace(/-/, '').toUpperCase())}Module`;
}
