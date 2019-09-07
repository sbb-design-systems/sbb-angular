import { SvgFile } from './svg-file';

const sizes = ['small', 'medium', 'large'];
const invalidModules = ['', 'svg', 'FPL', 'KOM', 'non-responsive', 'responsive', ...sizes];
const rules: Array<(svgFile: SvgFile) => void> = [
  file => sizes.filter(size => file.name.endsWith(size)).forEach(size => (file.size = size)),
  file => (file.modules = file.modules.filter(m => !invalidModules.includes(m))),
  file =>
    (file.modules = file.modules.map(m =>
      m
        .replace(/^Attribut$/, 'TimetableAttributes')
        .replace(/^HIM_CUS$/, 'HimCus')
        .replace(/^Produkt$/, 'TimetableProducts')
        .replace(/^\d+_/, '')
    )),
  file =>
    (file.name = file.name
      .replace(/^sbb_info$/, 'him_info')
      .replace(/^sbb_disruption$/, 'him_disruption')
      .replace(/^sbb_construction$/, 'him_construction')
      .replace(/^sbb_replacementbus$/, 'him_replacementbus')
      .replace(/^sbb_(\d+\_)?/i, '')
      .replace(/_[ ]?(\d{1,3}_)+(small|medium|large)$/, '')
      .replace(/_/g, '-')),
  file => (file.modules = file.modules.map((v, i, a) => `${a.slice(0, i).join('')}${v}`))
];
export default rules.map(r => (f: SvgFile) => {
  r(f);
  return f;
});
