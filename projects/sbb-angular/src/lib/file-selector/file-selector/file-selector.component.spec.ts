import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileSelectorComponent } from './file-selector.component';
import { Component } from '@angular/core';
import { FileSelectorModule } from '../file-selector.module';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '../../_common/testing/dispatch-events';

const testFileList: File[] = [
  {
    name: 'SampleAudio.mp3',
    size: 725240,
    type: 'audio/mp3',
    lastModified: 1550064416609,
    slice: null
  },
  {
    name: 'SampleDOC.doc',
    size: 204288,
    type: 'application/msword',
    lastModified: 1550064627491,
    slice: null
  },
  {
    name: 'SampleFLV.flv',
    size: 2097492,
    type: '',
    lastModified: 1550067468737,
    slice: null
  },
  {
    name: 'SampleJPGImage.jpg',
    size: 206993,
    type: 'image/jpeg',
    lastModified: 1550064740940,
    slice: null
  },
  {
    name: 'SamplePDF.pdf',
    size: 3028,
    type: 'application/pdf',
    lastModified: 1549979672772,
    slice: null
  },
  {
    name: 'SamplePNGImage.png',
    size: 207071,
    type: 'image/png',
    lastModified: 1550064744946,
    slice: null
  },
  {
    name: 'SampleSVGImage.svg',
    size: 53475,
    type: 'image/svg+xml',
    lastModified: 1550064751755,
    slice: null
  },
  {
    name: 'SampleVideo.mp4',
    size: 5253880,
    type: 'video/mp4',
    lastModified: 1550064537437,
    slice: null
  },
  {
    name: 'SampleXLS.xls',
    size: 38912,
    type: 'application/vnd.ms-excel',
    lastModified: 1550064593002,
    slice: null
  },
  {
    name: 'SampleZIP.zip',
    size: 10503575,
    type: 'application/x-zip-compressed',
    lastModified: 1550064649868,
    slice: null
  }
];


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

  let component: FileSelectorTestComponent;
  let fixture: ComponentFixture<FileSelectorTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FileSelectorModule],
      declarations: [FileSelectorTestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component test is created', (async () => {
    expect(component).toBeTruthy();
  }));

  it('should call fileChanged event when change event is triggered on input file', () => {
    const fileComponent = fixture.debugElement.query(By.directive(FileSelectorComponent));
    const fileInput = fileComponent.query(By.css('input[type="file"]'));

    spyOn(component, 'fileChanged');

    dispatchFakeEvent(fileInput.nativeElement, 'change');

    expect(component.fileChanged).toHaveBeenCalled();
  });

  it('should create a File List after calling the applyChanges method', () => {
    const fileComponent = fixture.debugElement.query(By.directive(FileSelectorComponent));

    fileComponent.componentInstance.applyChanges(testFileList);

    fixture.detectChanges();

    const filesItems = fileComponent.queryAll(By.css('.sbb-file-selector-list > li'));

    expect(filesItems.length).toBe(10);
  });

  it('should remove one item when clicking the remove button', () => {
    const fileComponent = fixture.debugElement.query(By.directive(FileSelectorComponent));

    fileComponent.componentInstance.applyChanges(testFileList);

    fixture.detectChanges();

    const firstRemoveButton = fileComponent.queryAll(By.css('.sbb-file-selector-list-remove-icon'))[0];

    firstRemoveButton.nativeElement.click();

    fixture.detectChanges();

    const filesItems = fileComponent.queryAll(By.css('.sbb-file-selector-list > li'));

    expect(filesItems.length).toBe(9);
  });

  it('should put proper file type icon', () => {
    const fileComponent = fixture.debugElement.query(By.directive(FileSelectorComponent));

    fileComponent.componentInstance.applyChanges(testFileList);

    fixture.detectChanges();

    const typeIconWrapper = fileComponent.queryAll(By.css('.sbb-file-selector-list-type-icon'));

    expect(typeIconWrapper[0].query(By.css('sbb-icon-sound'))).toBeTruthy();
    expect(typeIconWrapper[1].query(By.css('sbb-icon-doc'))).toBeTruthy();
    expect(typeIconWrapper[2].query(By.css('sbb-icon-doc-generic'))).toBeTruthy();
    expect(typeIconWrapper[3].query(By.css('sbb-icon-image'))).toBeTruthy();
    expect(typeIconWrapper[4].query(By.css('sbb-icon-pdf'))).toBeTruthy();
    expect(typeIconWrapper[5].query(By.css('sbb-icon-image'))).toBeTruthy();
    expect(typeIconWrapper[6].query(By.css('sbb-icon-image'))).toBeTruthy();
    expect(typeIconWrapper[7].query(By.css('sbb-icon-video'))).toBeTruthy();
    expect(typeIconWrapper[8].query(By.css('sbb-icon-doc'))).toBeTruthy();
    expect(typeIconWrapper[9].query(By.css('sbb-icon-zip'))).toBeTruthy();
  });
});
