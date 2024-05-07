import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbFileSelector, SbbFileSelectorModule } from './index';

const testFileList: Partial<File>[] = [
  {
    name: 'SampleAudio.mp3',
    size: 725240,
    type: 'audio/mp3',
    lastModified: 1550064416609,
    slice: null!,
  },
  {
    name: 'SampleDOC.doc',
    size: 204288,
    type: 'application/msword',
    lastModified: 1550064627491,
    slice: null!,
  },
  {
    name: 'SampleFLV.flv',
    size: 2097492,
    type: '',
    lastModified: 1550067468737,
    slice: null!,
  },
  {
    name: 'SampleJPGImage.jpg',
    size: 206993,
    type: 'image/jpeg',
    lastModified: 1550064740940,
    slice: null!,
  },
  {
    name: 'SamplePDF.pdf',
    size: 3028,
    type: 'application/pdf',
    lastModified: 1549979672772,
    slice: null!,
  },
  {
    name: 'SamplePNGImage.png',
    size: 207071,
    type: 'image/png',
    lastModified: 1550064744946,
    slice: null!,
  },
  {
    name: 'SampleSVGImage.svg',
    size: 53475,
    type: 'image/svg+xml',
    lastModified: 1550064751755,
    slice: null!,
  },
  {
    name: 'SampleVideo.mp4',
    size: 5253880,
    type: 'video/mp4',
    lastModified: 1550064537437,
    slice: null!,
  },
  {
    name: 'SampleXLS.xls',
    size: 38912,
    type: 'application/vnd.ms-excel',
    lastModified: 1550064593002,
    slice: null!,
  },
  {
    name: 'SampleZIP.zip',
    size: 10503575,
    type: 'application/x-zip-compressed',
    lastModified: 1550064649868,
    slice: null!,
  },
];

@Component({
  selector: 'sbb-file-test',
  template: `
    <sbb-file-selector
      (fileChanged)="fileChanged($event)"
      [multiple]="multiple"
    ></sbb-file-selector>
  `,
  standalone: true,
  imports: [SbbFileSelectorModule],
})
class FileSelectorTestComponent {
  filesList1: File[] = [];
  multiple = false;

  fileChanged(filesList: File[]) {
    this.filesList1 = filesList;
  }
}

describe('SbbFileSelector using mock component', () => {
  let component: FileSelectorTestComponent;
  let fixture: ComponentFixture<FileSelectorTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSelectorTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component test is created', async () => {
    expect(component).toBeTruthy();
  });

  it('should call fileChanged event when change event is triggered on input file', () => {
    const fileComponent = fixture.debugElement.query(By.directive(SbbFileSelector));
    const fileInput = fileComponent.query(By.css('input[type="file"]'));

    spyOn(component, 'fileChanged');

    dispatchFakeEvent(fileInput.nativeElement, 'change');

    expect(component.fileChanged).toHaveBeenCalled();
  });

  it('should create a File List after calling the applyChanges method', () => {
    const fileComponent = fixture.debugElement.query(By.directive(SbbFileSelector));

    fileComponent.componentInstance.applyChanges(testFileList);
    fixture.detectChanges();

    const filesItems = fileComponent.queryAll(By.css('.sbb-file-selector-list > li'));

    expect(filesItems.length).toBe(10);
  });

  it('should add / remove the `multiple` attribute to the underlying input element', () => {
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
    expect(fileInput.nativeElement.getAttribute('multiple')).toEqual('true');

    fixture.componentInstance.multiple = false;
    fixture.detectChanges();
    expect(fileInput.nativeElement.hasAttribute('multiple')).toBe(false);
  });

  it('should add files to File List when the multipleMode is set to "persistent"', () => {
    const fileComponent = fixture.debugElement.query(By.directive(SbbFileSelector));

    const firstList = testFileList.slice(0, 2);
    const secondList = testFileList.slice(5, 7);

    fileComponent.componentInstance.filesList = [];
    fileComponent.componentInstance.multiple = true;
    fileComponent.componentInstance.multipleMode = 'persistent';

    fileComponent.componentInstance.applyChanges(firstList);

    fixture.detectChanges();

    fileComponent.componentInstance.applyChanges(secondList);

    fixture.detectChanges();

    const filesItems = fileComponent.queryAll(By.css('.sbb-file-selector-list > li'));

    expect(filesItems.length).toBe(4);
  });

  it('should remove one item when clicking the remove button', () => {
    const fileComponent = fixture.debugElement.query(By.directive(SbbFileSelector));

    fileComponent.componentInstance.applyChanges(testFileList);

    fixture.detectChanges();

    const firstRemoveButton = fileComponent.queryAll(
      By.css('.sbb-file-selector-list-remove-icon'),
    )[0];

    firstRemoveButton.nativeElement.click();

    fixture.detectChanges();

    const filesItems = fileComponent.queryAll(By.css('.sbb-file-selector-list > li'));

    expect(filesItems.length).toBe(9);
  });

  it('should put proper file type icon', () => {
    const fileComponent = fixture.debugElement.query(By.directive(SbbFileSelector));

    fileComponent.componentInstance.applyChanges(testFileList);

    fixture.detectChanges();

    const typeIconWrapper = fileComponent.queryAll(By.css('.sbb-file-selector-list-type-icon'));

    expect(
      typeIconWrapper[0].query(By.css('sbb-icon[svgIcon="document-sound-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[1].query(By.css('sbb-icon[svgIcon="document-text-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[2].query(By.css('sbb-icon[svgIcon="document-standard-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[3].query(By.css('sbb-icon[svgIcon="document-image-small"]')),
    ).toBeTruthy();
    expect(typeIconWrapper[4].query(By.css('sbb-icon[svgIcon="document-pdf-small"]'))).toBeTruthy();
    expect(
      typeIconWrapper[5].query(By.css('sbb-icon[svgIcon="document-image-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[6].query(By.css('sbb-icon[svgIcon="document-image-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[7].query(By.css('sbb-icon[svgIcon="document-video-small"]')),
    ).toBeTruthy();
    expect(
      typeIconWrapper[8].query(By.css('sbb-icon[svgIcon="document-text-small"]')),
    ).toBeTruthy();
    expect(typeIconWrapper[9].query(By.css('sbb-icon[svgIcon="document-zip-small"]'))).toBeTruthy();
  });
});

@Component({
  selector: 'sbb-file-selector-test2',
  template: `
    <sbb-file-selector (fileChanged)="onFileChange($event)" [(ngModel)]="files"></sbb-file-selector>
  `,
  standalone: true,
  imports: [SbbFileSelectorModule, FormsModule],
})
class FileSelectorTest2Component {
  files: File[] = [];

  onFileChange(files: File[]) {
    if (!files[0]) {
      return;
    }
    this.files = [];
  }
}

describe('SbbFileSelector using mock component and limited behaviour ', () => {
  let fileSelectorTest2Component: FileSelectorTest2Component;
  let fixtureFileSelectorTest2: ComponentFixture<FileSelectorTest2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbIconTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixtureFileSelectorTest2 = TestBed.createComponent(FileSelectorTest2Component);
    fileSelectorTest2Component = fixtureFileSelectorTest2.componentInstance;
    fixtureFileSelectorTest2.detectChanges();
  });

  it('component test is created', async () => {
    expect(fileSelectorTest2Component).toBeTruthy();
  });

  it('should call onFileChanged event and have length of li elements equals to 0', () => {
    const oneElement = testFileList.slice(0, 1);
    const fileComponent = fixtureFileSelectorTest2.debugElement.query(
      By.directive(SbbFileSelector),
    );
    const cd: ChangeDetectorRef = fileComponent.componentInstance._changeDetector;
    spyOn(cd, 'detectChanges');
    fileComponent.componentInstance.applyChanges(oneElement);
    expect(cd.detectChanges).toHaveBeenCalled();
  });
});
