var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// tools/schematics/selector-groups/index.ts
__export(exports, {
  selectorGroups: () => selectorGroups
});
function selectorGroups(options) {
  return (tree, _context) => {
    const srcDir = tree.getDir("src");
    const dirs = srcDir.subdirs.filter((d) => d.startsWith("angular-") && !d.endsWith("-icons")).map((d) => srcDir.dir(d));
    const modules = JSON.parse(JSON.stringify(wellKnownModules));
    for (const dir of dirs) {
      dir.visit((path, entry) => {
        if (entry && path.endsWith(".ts") && !path.endsWith(".spec.ts") && !path.includes("/schematics/")) {
          const matches = entry.content.toString().matchAll(/selector: ["'`]([^"'`]+)/g);
          for (const match of matches) {
            const moduleName = path.split("/")[3];
            const selectors = match[1].split(/[\s,]+/);
            for (const selector of selectors) {
              const normalizedSelector = selector.includes("[") && !selector.startsWith("[") ? selector.substring(selector.indexOf("[")) : selector;
              if (blocklist.includes(selector)) {
              } else if (!(moduleName in modules)) {
                modules[moduleName] = [normalizedSelector];
              } else if (!modules[moduleName].includes(normalizedSelector)) {
                modules[moduleName].push(normalizedSelector);
              }
            }
          }
        }
      });
    }
    const result = {};
    Object.keys(modules).sort().forEach((k) => result[k] = modules[k]);
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result);
      console.log(`Amount of searchable selectors: ${Object.values(result).reduce((current, next) => current + next.length, 0)}`);
    }
  };
}
var wellKnownModules = {
  accordion: ["sbb-accordion", "sbb-expansion-panel"],
  autocomplete: ["sbb-autocomplete"],
  badge: ["sbb-badge"],
  breadcrumb: ["sbb-breadcrumbs"],
  button: ["[sbbButton]"],
  captcha: ["sbb-captcha"],
  checkbox: ["sbb-checkbox"],
  "checkbox-panel": ["sbb-checkbox-panel"],
  chip: ["sbb-chip", "sbb-chip-input"],
  contextmenu: ["sbb-contextmenu"],
  datepicker: ["[sbbDateInput]", "sbb-datepicker"],
  dialog: ["sbb-dialog-content", "[sbbDialogContent]"],
  dropdown: ["sbb-dropdown"],
  "esri-basemap-gallery": ["sbb-esri-basemap-gallery"],
  "esri-layer-list": ["sbb-esri-layer-list"],
  "esri-legend": ["sbb-esri-legend"],
  "esri-web-map": ["sbb-esri-web-map"],
  "esri-web-scene": ["sbb-esri-web-scene"],
  "file-selector": ["sbb-file-selector"],
  "form-field": ["sbb-field", "sbb-form-field"],
  ghettobox: ["sbb-ghettobox"],
  header: ["sbb-header"],
  icon: ["sbb-icon"],
  input: ["[sbbInput]"],
  lightbox: ["sbb-lightbox-content", "[sbbLightboxContent]"],
  links: ["[sbbLink]"],
  loading: ["sbb-loading"],
  notification: ["sbb-notification"],
  option: ["sbb-option-group"],
  pagination: ["sbb-navigation", "sbb-pagination", "sbb-paginator"],
  processflow: ["sbb-processflow"],
  "radio-button": ["sbb-radio-button", "sbb-radio-group"],
  "radio-button-panel": ["sbb-radio-button-panel"],
  search: ["sbb-search"],
  select: ["sbb-select"],
  sidebar: ["sbb-icon-sidebar", "sbb-sidebar"],
  status: ["sbb-status"],
  table: ["sbb-table", "[sbbTable]"],
  tabs: ["sbb-tabs"],
  tag: ["sbb-tag", "sbb-tags"],
  textarea: ["sbb-textarea"],
  textexpand: ["sbb-textexpand"],
  "time-input": ["[sbbTimeInput]"],
  toggle: ["sbb-toggle"],
  tooltip: ["sbb-tooltip", "[sbbTooltip]"],
  usermenu: ["sbb-usermenu"]
};
var blocklist = [
  "sbb-error",
  "[sbbError]",
  "sbb-label",
  "ng-template[sbbExpansionPanelContent]",
  "sbb-expansion-panel-header",
  "sbb-autocomplete-hint",
  "[sbbAutocompleteOrigin]",
  "input[sbbAutocomplete]",
  "[sbb-breadcrumb-root]",
  "sbb-breadcrumb",
  "input[type=submit][sbbButton]",
  "sbb-checkbox[required][formControlName]",
  "sbb-checkbox[required][formControl]",
  "sbb-checkbox[required][ngModel]",
  "sbb-checkbox-panel-subtitle",
  "sbb-checkbox-panel-warning",
  "sbb-checkbox-panel-note",
  "input[sbbChipInputFor]",
  "input[sbbChipInput]",
  "sbb-chip-trailing-icon",
  "[sbbChipTrailingIcon]",
  "sbb-basic-chip",
  "[sbb-basic-chip]",
  "[sbbChipRemove]",
  "[sbbIcon]",
  "sbb-optgroup",
  "sbb-option",
  "sbb-pseudo-checkbox",
  "sbb-calendar-header",
  "sbb-calendar",
  "[sbb-calendar-body]",
  "sbb-datepicker-content",
  "sbb-datepicker-toggle",
  "sbb-month-view",
  "sbb-dialog-container",
  "[sbb-dialog-close]",
  "[sbbDialogClose]",
  "sbb-dialog-title",
  "[sbb-dialog-title]",
  "[sbbDialogTitle]",
  "[sbb-dialog-actions]",
  "sbb-dialog-actions",
  "[sbbDialogActions]",
  "button[sbbDialogClose]",
  "sbb-dialog-footer",
  "[sbbDialogFooter]",
  "sbb-dialog-header",
  "[sbbDialogHeader]",
  "sbb-lightbox-container",
  "[sbb-lightbox-close]",
  "[sbbLightboxClose]",
  "sbb-lightbox-title",
  "[sbb-lightbox-title]",
  "[sbbLightboxTitle]",
  "[sbb-lightbox-actions]",
  "sbb-lightbox-actions",
  "[sbbLightboxActions]",
  "button[sbbLightboxClose]",
  "sbb-lightbox-header",
  "[sbbLightboxHeader]",
  "sbb-lightbox-footer",
  "[sbbLightboxFooter]",
  "ng-template[sbbMenuContent]",
  "[sbbMenuDynamicTrigger]",
  "[sbb-menu-item]",
  "button[sbbProcessflowNext]",
  "button[sbbProcessflowPrevious]",
  "sbb-step",
  "ng-template[sbbStepContent]",
  "sbb-step-header",
  "[sbbStepLabel]",
  "sbb-processflow-step",
  "sbb-radio-button-panel-subtitle",
  "sbb-radio-button-panel-warning",
  "sbb-radio-button-panel-note",
  "a[sbbIconSidebarItem]",
  "sbb-icon-sidebar-content",
  "sbb-icon-sidebar-container",
  "a[sbbSidebarLink]",
  "sbb-sidebar-content",
  "sbb-sidebar-container",
  "[sbbTabBodyHost]",
  "sbb-tab-body",
  "[sbbTabContent]",
  "sbb-tab-header",
  "[sbbTabLabelWrapper]",
  "[sbb-tab-label]",
  "[sbbTabLabel]",
  "[sbb-tab-link]",
  "[sbbTabLink]",
  "sbb-tab",
  "ng-template[sbbTabContent]",
  "sbb-textexpand-collapsed",
  "sbb-textexpand-expanded",
  "[sbbDropdownItem]",
  "[sbbDropdownOrigin]",
  "[sbbDropdown]",
  "sbb-app-chooser-section",
  "sbb-header-environment",
  "sbb-header-menu",
  "[sbbHeaderMenuItem]",
  "button[sbbHeaderMenu]",
  "sbb-notification-toast-container",
  "sbb-simple-notification",
  "[sbbSort]",
  "[sbbSortHeader]",
  "[sbbCellDef]",
  "[sbbHeaderCellDef]",
  "[sbbFooterCellDef]",
  "[sbbColumnDef]",
  "sbbHeaderCell",
  "th[sbbHeaderCell]",
  "sbbFooterCell",
  "td[sbbFooterCell]",
  "sbbCell",
  "td[sbbCell]",
  "[sbbHeaderRowDef]",
  "[sbbFooterRowDef]",
  "[sbbRowDef]",
  "sbb-header-row",
  "tr[sbbHeaderRow]",
  "sbb-footer-row",
  "tr[sbbFooterRow]",
  "sbb-row",
  "tr[sbbRow]",
  "sbb-text-column",
  "sbb-tooltip-container",
  "a[sbb-usermenu-item]",
  "button[sbb-usermenu-item]",
  "[sbbIcon]",
  "sbb-ghettobox-container",
  "sbb-toggle-option"
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  selectorGroups
});
