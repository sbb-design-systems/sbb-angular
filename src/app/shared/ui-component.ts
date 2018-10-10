import { Thumbnail } from './thumbnail';
import { Type } from '@angular/core';

export class UiComponent {
    constructor(
        public id: string,
        public routerLink: string,
        public title: string,
        public subTitle: string,
        public isComponent: Boolean,
        public isDirective: Boolean,
        public authors: string[],
        public description: string,
        public component?: Type<{}>,
        public documentationImportComponent?: Type<{}>,
        public documentationSourceComponent?: Type<{}>,
        public documentationGettingStartedComponent?: Type<{}>,
        public documentationPropertiesComponent?: Type<{}>,
        public documentationModelBindingComponent?: Type<{}>,
        public documentationStylingComponent?: Type<{}>,
        public documentationDependenciesComponent?: Type<{}>,
        public documentationEventsComponent?: Type<{}>,
        public documentationAutoResizeComponent?: Type<{}>,
        public documentationIconsComponent?: Type<{}>,
        public thumbnails?: Thumbnail[]
    ) { }
}
