# SbbAngularShowcase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.0-rc.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## How to create a new component
1. Create a new module into the projects/sbb-angular/ using angular CLI 
2. The module has to be named accordingly to the Confluence requirement
  
	Example for textarea:   
		cli command: ng generate module textarea --project=sbb-angular --spec=false  
		component name: textarea  
		result: textarea.module.ts  
		base module path: projects/sbb-angular/src/lib/textarea/  
		
3. Create a new component into the projects/sbb-angular/ using angular CLI for the module just created
4. The component has to be name accordingly to the Confluence requirement and placed in the module sub-folder
  	
	Example for textarea:   
		cli command: ng generate component textarea/textarea --project=sbb-angular  
		component name: textarea  
		result: textarea.component.ts,  textarea.component.html,  textarea.component.spec.ts,  textarea.component.scss  
		component path: projects/sbb-angular/src/lib/textarea/textarea  
	(you may have more components per module)  
  	
5. Create a index.js path into the base module path and export the module and the component(s) created
6. Augment the projects/sbb-angular/src/public_api.ts with the index.js export declaration
