import { SvgFile } from './svg-file';

const sizes = ['small', 'medium', 'large'];
const invalidModules = ['', 'svg', 'FPL', 'KOM', 'non-responsive', 'responsive', ...sizes];
const rules: Array<(svgFile: SvgFile) => void> = [
  file => sizes
    .filter(size => file.name.endsWith(size))
    .forEach(size => file.size = size),
  file => file.modules = file.modules.filter(m => !invalidModules.includes(m)),
  file => file.modules = file.modules.map(m => m
    .replace(/^Attribut$/, 'TimetableAttributes')
    .replace(/^HIM_CUS$/, 'HimCus')
    .replace(/^Produkt$/, 'TimetableProducts')
    .replace(/^\d+_/, '')),
  file => file.name = file.name
    .replace(/^fog_327/, 'cloud_fog_327')
    .replace(/^cloud_sun_197/, 'cloud_sunshine_197')
    .replace(/^user_group_row_056/, 'user_group_row_linear_056')
    .replace(/^bus_stop_242/, 'bus_sbb_242')
    .replace(/^sbb_info$/, 'him_info')
    .replace(/^sbb_disruption$/, 'him_disruption')
    .replace(/^sbb_construction$/, 'him_construction')
    .replace(/^sbb_replacementbus$/, 'him_replacementbus')
    .replace(/^sbb_(\d+\_)?/i, '')
    .replace(/moutain/, 'mountain')
    .replace(/_[ ]?(\d{3}_)+(small|medium|large)$/, '')
    .replace(/^auslastung_0$/, 'utilization_none')
    .replace(/^auslastung_1$/, 'utilization_low')
    .replace(/^auslastung_2$/, 'utilization_medium')
    .replace(/^auslastung_3$/, 'utilization_high')
    .replace(/_/g, '-'),
  file => file.modules = file.modules.map((v, i, a) => `${a.slice(0, i).join('')}${v}`),
];
export const namingRules: Array<(svgFile: SvgFile) => SvgFile> = rules.map(r => (f: SvgFile) => {
  r(f);
  return f;
});
