export interface ShowcaseMetaPackage {
  name: string;
  svgIcon: string;
  image: string;
  description: string;
  sections: ShowcaseMetaSection[];
}

export interface ShowcaseMetaSection {
  name: string;
  entries: ShowcaseMetaEntry[];
}

export interface ShowcaseMetaEntry {
  label: string;
  link: string;
  variantOnly?: 'standard' | 'lean';
}

export const PACKAGES: { [key: string]: ShowcaseMetaPackage } = {
  angular: {
    name: '@sbb-esta/angular',
    svgIcon: 'kom:browser-small',
    image: 'assets/websites.jpg',
    description: 'Components which can be used for websites and webapps.',
    sections: [
      {
        name: 'Introduction',
        entries: [
          { label: 'Getting started', link: './introduction/getting-started' },
          { label: 'Migration Guide', link: './introduction/migration-guide' },
          { label: 'i18n', link: './introduction/i18n' },
          { label: 'Typography', link: './introduction/typography' },
          { label: 'Icon Overview', link: './icon-overview' },
          { label: 'Oauth', link: './components/oauth' },
        ],
      },
      {
        name: 'Form Components',
        entries: [
          { label: 'Autocomplete', link: './components/autocomplete' },
          { label: 'Captcha', link: './components/captcha' },
          { label: 'Checkbox', link: './components/checkbox' },
          { label: 'Checkbox Panel', link: './components/checkbox-panel' },
          { label: 'Chip Input', link: './components/chip', variantOnly: 'lean' },
          { label: 'Datepicker', link: './components/datepicker' },
          { label: 'Form Field', link: './components/form-field' },
          { label: 'File Selector', link: './components/file-selector' },
          { label: 'Radiobutton', link: './components/radio-button' },
          { label: 'Radiobutton Panel', link: './components/radio-button-panel' },
          { label: 'Select', link: './components/select' },
          { label: 'Tag', link: './components/tag' },
          { label: 'Textarea', link: './components/textarea' },
          { label: 'Time Input', link: './components/time-input' },
          { label: 'Toggle', link: './components/toggle' },
        ],
      },
      {
        name: 'Navigation Components',
        entries: [
          { label: 'Header', link: './components/header', variantOnly: 'lean' },
          { label: 'Sidebar', link: './components/sidebar', variantOnly: 'lean' },
        ],
      },
      {
        name: 'Layout Components',
        entries: [
          { label: 'Accordion', link: './components/accordion' },
          { label: 'Breadcrumb', link: './components/breadcrumb' },
          { label: 'Ghettobox', link: './components/ghettobox', variantOnly: 'standard' },
          { label: 'Notification', link: './components/notification' },
          { label: 'Pagination', link: './components/pagination' },
          { label: 'Processflow', link: './components/processflow' },
          { label: 'Table', link: './components/table' },
          { label: 'Tabs', link: './components/tabs' },
          { label: 'Textexpand', link: './components/textexpand' },
          { label: 'Usermenu', link: './components/usermenu' },
        ],
      },
      {
        name: 'Button & Indicator Components',
        entries: [
          { label: 'Button', link: './components/button' },
          { label: 'Icon', link: './components/icon' },
          { label: 'Loading', link: './components/loading' },
          { label: 'Menu', link: './components/menu' },
          { label: 'Search', link: './components/search' },
          { label: 'Status', link: './components/status' },
        ],
      },
      {
        name: 'Popup & Modal Components',
        entries: [
          { label: 'Dialog', link: './components/dialog', variantOnly: 'lean' },
          { label: 'Lightbox', link: './components/lightbox', variantOnly: 'standard' },
          {
            label: 'Notification Toast',
            link: './components/notification-toast',
            variantOnly: 'lean',
          },
          { label: 'Tooltip', link: './components/tooltip' },
        ],
      },
    ],
  },
  'angular-maps': {
    name: '@sbb-esta/angular-maps',
    svgIcon: 'kom:location-pin-map-small',
    image: 'assets/maps.jpg',
    description: 'Components to display 2D/3D maps and to provide map interaction..',
    sections: [
      {
        name: 'Introduction',
        entries: [
          { label: 'Getting started', link: './introduction/getting-started' },
          { label: 'Overview and usage', link: './introduction/overview-and-usage' },
          { label: 'Mapping basics', link: './introduction/mapping-basics' },
        ],
      },
      {
        name: 'Maps',
        entries: [
          { label: 'WebMap', link: './components/esri-web-map' },
          { label: 'WebScene', link: './components/esri-web-scene' },
        ],
      },
      {
        name: 'Map Utilities',
        entries: [
          { label: 'Layerlist', link: './components/esri-layer-list' },
          { label: 'Basemap Gallery', link: './components/esri-basemap-gallery' },
          { label: 'Legend', link: './components/esri-legend' },
        ],
      },
    ],
  },
};

export function findPackageEntry(packageName: string, componentId: string): ShowcaseMetaEntry {
  for (const section of PACKAGES[packageName].sections) {
    const foundEntry = section.entries.find((entry) => entry.link.endsWith(componentId));
    if (foundEntry) {
      return foundEntry;
    }
  }
}
