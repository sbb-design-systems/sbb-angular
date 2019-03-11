import {
  Component,
  Inject,
  Input,
  Optional,
  ChangeDetectionStrategy,
  forwardRef,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { FileSelectorOptions, FILE_SELECTOR_OPTIONS, FileTypeCategory } from './file-selector-base';
import { FileSelectorTypesService } from './file-selector-types.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

let counter = 0;

@Component({
  selector: 'sbb-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileSelectorComponent),
      multi: true,
    },
  ]
})
export class FileSelectorComponent implements ControlValueAccessor, FileSelectorOptions {

  /**
   * Categories of file types accepted by sbb-file-selector component.
   */
  @Input() accept?: string;
  /**
   * Attribute whose state specifies the preferred facing mode for the media capture mechanism.
   */
  @Input() capture?: 'user' | 'environment';

  /**
   * Mode on file selector component to chose more files to upload.
   */
  @Input() multiple?: boolean;

  /**
   * Set if the component should add files on top of the already selected ones or keep default input file behaviour.
   */
  @Input() multipleMode: 'default' | 'persistent' = 'default';

  /**
   * Mode to disable the choice of files to upload.
   */
  @Input() disabled?: boolean;

  /**
   * Identifier of a sbb-file-selector component.
   */
  @Input() inputId = `sbb-file-selector-${counter++}`;

  /**
   * Event emitted to a change on file selector component (for example the uploading of files).
   */
  @Output() fileChanged = new EventEmitter<File[]>();

  /**
   * @docs-private
   */
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  /**
   * List of files uploaded.
   */
  filesList: File[];

  /**
   * File type category available.
   */
  fileTypeCategory = FileTypeCategory;

  /**
   * Property that listens changes on file selector.
   */
  onChange = (_: File[]) => { };

  /**
   * Property that catches the interaction with user.
   */
  onTouched = () => { };

  constructor(
    private _fileTypeService: FileSelectorTypesService,
    private _renderer: Renderer2,
    private _changeDetector: ChangeDetectorRef,
    @Optional() @Inject(FILE_SELECTOR_OPTIONS) options: FileSelectorOptions
  ) {
    if (options) {
      this.accept = options.accept;
      this.capture = options.capture;
      this.multiple = options.multiple;
      this.multipleMode = options.multipleMode;
    }
  }

  writeValue(value: any) { this.filesList = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * Applies changes on the list of files uploaded.
   * @param files Files uploaded.
   */
  fileChange(files: FileList) {
    const arrayFiles: File[] = Array.from(files);
    this.applyChanges(arrayFiles);
  }

  /**
   * Applies changes on sbb-file-selector.
   * @param files Files uploaded.
   */
  applyChanges(files: File[], action: 'add' | 'remove' = 'add'): void {
    const filesToAdd = action === 'add' ? this.getFileListByMode(files) : files;
    this._renderer.setProperty(this.fileInput.nativeElement, 'value', null);
    this.onChange(filesToAdd);
    this.writeValue(filesToAdd);
    this.fileChanged.emit(filesToAdd);
  }

  /**
   * Returns the file type category by the file type in input.
   * @param file File.
   * @returns File type category of the file type in input.
   */
  getFileTypeCat(file: File): FileTypeCategory {
    return this._fileTypeService.getFileTypeCategoryByMimeType(file.type);
  }

  /**
   * Returns the list of files without the file deleted.
   * @param file File to delete.
   * @returns List of files without the file deleted.
   */
  removeFile(file: File): void {
    const filteredList = this.filesList.filter(f => !this.checkFileEquality(f, file));
    this.applyChanges(filteredList, 'remove');
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  private getFileListByMode(incomingFiles: File[]): File[] {
    if (this.multiple && this.multipleMode === 'persistent') {
      return incomingFiles.filter(f => {
        return this.filesList.findIndex(flItem => this.checkFileEquality(f, flItem)) === -1;
      })
        .concat(this.filesList);
    }

    return incomingFiles;
  }

  private checkFileEquality(file1: File, file2: File): boolean {
    return file1.name === file2.name
      && file1.size === file2.size
      && file1.lastModified === file2.lastModified;
  }
}
