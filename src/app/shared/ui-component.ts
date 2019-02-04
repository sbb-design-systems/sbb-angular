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
        public source: string,
        public importText: string,
        public component?: Type<{}>,
        public htmlExamples?: string[]
    ) { }
}
