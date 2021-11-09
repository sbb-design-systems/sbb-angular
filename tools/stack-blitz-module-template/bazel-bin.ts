import { writeFileSync } from 'fs';

if (require.main === module) {
  const [targetPath, packageName, ...modules] = process.argv.slice(2);
  const template = `import { NgModule } from '@angular/core';
${modules.map((m) => `import { ${toModuleName(m)} } from '${packageName}/${m}';`).join('\n')}

const modules = [
  ${modules.map(toModuleName).join(',\n  ')},
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
