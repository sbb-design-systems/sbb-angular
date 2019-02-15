import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileSelectorComponent } from './file-selector.component';
import { IconCollectionBaseDocumentsModule, IconTrashModule, IconUploadModule } from '../../svg-icons/svg-icons';
import { Component } from '@angular/core';
import { FileSelectorModule } from '../file-selector.module';

describe('FileSelectorComponent', () => {
    let component: FileSelectorComponent;
    let fixture: ComponentFixture<FileSelectorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IconCollectionBaseDocumentsModule, IconTrashModule, IconUploadModule],
            declarations: [FileSelectorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({
    selector: 'sbb-file-test',
    template: `<h4 class="sbbsc-block">Simple example (single file)</h4>
               <sbb-file-selector (fileChanged)="fileChanged($event)"></sbb-file-selector>`
})
class FileSelectorTestComponent {

    filesList1: File[] = [];

    fileChanged(filesList: File[]) {
        this.filesList1 = filesList;
    }

}

describe('FileSelectorComponent using mock component', () => {

    let componentTest: FileSelectorTestComponent;
    let fixtureTest: ComponentFixture<FileSelectorTestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [FileSelectorModule],
        declarations: [FileSelectorTestComponent]
      }).compileComponents();
    }));

    beforeEach(() => {

      fixtureTest = TestBed.createComponent(FileSelectorTestComponent);
      componentTest = fixtureTest.componentInstance;
      fixtureTest.detectChanges();
    });

    it('component test is created',(async() => {
      expect(componentTest).toBeTruthy();
    }));

  });
