import { writeFileSync } from 'fs';
import https from 'https';

interface IconDefinition {
  name: string;
  namespace?: string;
  tags: string[];
  scalable?: boolean;
}

interface IconAPIResponse {
  icons: IconDefinition[];
}

const CDN_ICON_URL = 'https://icons.app.sbb.ch/icons/index.json';

(async function () {
  const iconNames = await fetchIconsFromUrl(CDN_ICON_URL);

  writeFileSync(
    './src/angular/schematics/ng-update/migrations/sbb-icon-names.json',
    `${JSON.stringify(iconNames, null, 2)}\n`,
    'utf8',
  );
})();

function fetchIconsFromUrl(url: string): Promise<string[]> {
  return new Promise((resolve) => {
    https
      .get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          const response = JSON.parse(data) as IconAPIResponse;
          const icons = response.icons.map((icon) => icon.name);
          resolve(icons);
        });
      })
      .on('error', (err) => {
        console.error('Error: ' + err.message);
      });
  });
}
