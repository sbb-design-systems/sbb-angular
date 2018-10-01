import { Thumbnail } from './thumbnail';

export class UiComponent {
    constructor(
        public id: string,
        public routerLink: string,
        public title:string,
        public subTitle: string,
        public isComponent: Boolean,
        public isDirective: Boolean,
        public authors: string[],
        public description: string,
        public source: string,
        public importText: string,
        public gettingStartedText: string,
        public modelBindingText: string,
        public iconsText: string,
        public autoResizeText: string,
        public propertiesText: string,
        public eventsText: string,
        public stylingText: string,
        public dependenciesText: string,
        public thumbnails?: Thumbnail[]
    ) {}
}
