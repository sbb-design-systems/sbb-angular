

exports.getTemplate = function (iconSelector, iconTemplate, iconComponentName) {
  return `import { Component } from '@angular/core';
        @Component({
          selector: '${iconSelector}',
          // tslint:disable-next-line:max-line-length
          template: '${iconTemplate}',
          styles: []
        })
        export class ${iconComponentName} {
          constructor() { }
          // tslint:disable-next-line:eofline
        }`;
};

