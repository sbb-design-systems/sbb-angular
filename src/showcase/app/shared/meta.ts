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
          { label: 'i18n', link: './introduction/i18n' },
          { label: 'Typography', link: './introduction/typography' },
          { label: 'Icon Overview', link: './icon-overview' },
          { label: 'Oauth', link: './components/oauth' },
        ],
      },
      {
        name: 'Guides',
        entries: [
          { label: 'Migration Guide v12 to v13', link: './guides/migration-guide' },
          {
            label: 'Custom form field control',
            link: './guides/creating-a-custom-form-field-control',
          },
        ],
      },
      {
        name: 'Components',
        entries: [
          { label: 'Accordion', link: './components/accordion' },
          { label: 'Alert', link: './components/alert', variantOnly: 'standard' },
          { label: 'Autocomplete', link: './components/autocomplete' },
          { label: 'Badge', link: './components/badge' },
          { label: 'Breadcrumb', link: './components/breadcrumb' },
          { label: 'Button', link: './components/button' },
          { label: 'Captcha', link: './components/captcha' },
          { label: 'Checkbox', link: './components/checkbox' },
          { label: 'Checkbox Panel', link: './components/checkbox-panel' },
          { label: 'Chips', link: './components/chips', variantOnly: 'lean' },
          { label: 'Datepicker', link: './components/datepicker' },
          { label: 'Dialog', link: './components/dialog', variantOnly: 'lean' },
          { label: 'Form Field', link: './components/form-field' },
          { label: 'File Selector', link: './components/file-selector' },
          { label: 'Header Lean', link: './components/header-lean', variantOnly: 'lean' },
          { label: 'Icon', link: './components/icon' },
          { label: 'Input', link: './components/input' },
          { label: 'Lightbox', link: './components/lightbox', variantOnly: 'standard' },
          { label: 'Loading Indicator', link: './components/loading-indicator' },
          { label: 'Menu', link: './components/menu' },
          { label: 'Notification', link: './components/notification' },
          {
            label: 'Notification Toast',
            link: './components/notification-toast',
            variantOnly: 'lean',
          },
          { label: 'Pagination', link: './components/pagination' },
          { label: 'Processflow', link: './components/processflow' },
          { label: 'Radiobutton', link: './components/radio-button' },
          { label: 'Radiobutton Panel', link: './components/radio-button-panel' },
          { label: 'Search', link: './components/search' },
          { label: 'Select', link: './components/select' },
          { label: 'Sidebar', link: './components/sidebar', variantOnly: 'lean' },
          { label: 'Status', link: './components/status' },
          { label: 'Table', link: './components/table' },
          { label: 'Tabs', link: './components/tabs' },
          { label: 'Tag', link: './components/tag' },
          { label: 'Textarea', link: './components/textarea' },
          { label: 'Textexpand', link: './components/textexpand' },
          { label: 'Time Input', link: './components/time-input' },
          { label: 'Toggle', link: './components/toggle' },
          { label: 'Tooltip', link: './components/tooltip' },
          { label: 'Usermenu', link: './components/usermenu' },
        ],
      },
    ],
  },
  'angular-experimental': {
    name: '@sbb-esta/angular-experimental',
    svgIcon: 'kom:cloud-lightning-small',
    image: 'assets/websites.jpg',
    description: 'Experimental components which can be used for websites and webapps.',
    sections: [
      {
        name: 'Introduction',
        entries: [{ label: 'Getting started', link: './introduction/getting-started' }],
      },
      {
        name: 'Modules',
        entries: [{ label: 'Example', link: './components/example' }],
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
          { label: 'Basemap Gallery', link: './components/esri-basemap-gallery' },
          { label: 'Layerlist', link: './components/esri-layer-list' },
          { label: 'Legend', link: './components/esri-legend' },
        ],
      },
      {
        name: 'Advanced Usage',
        entries: [
          { label: 'Using ArcGIS types', link: './advanced/using-arcgis-types' },
          { label: 'Layer filtering', link: './advanced/layer-filtering' },
          { label: 'Accessing map data', link: './advanced/accessing-map-data' },
        ],
      },
    ],
  },
  'journey-maps': {
    name: '@sbb-esta/journey-maps',
    svgIcon: 'kom:switzerland-route-small',
    image: 'assets/journey-maps.jpg',
    description: '',
    sections: [
      {
        name: 'Introduction',
        entries: [
          { label: 'Getting started', link: './introduction/getting-started' },
          { label: 'VS angular-maps', link: './introduction/comparison' },
          {
            label: 'Migrate from ROKAS',
            link: './introduction/migrate-from-rokas',
          },
        ],
      },
      {
        name: 'Components',
        entries: [
          { label: 'JourneyMaps', link: './components/angular' },
          { label: 'JourneyMaps Web Component', link: './components/web-component' },
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
