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
  applyChanges(files: File[]): void {
    this.onChange(files);
    this.writeValue(files);
    this.fileChanged.emit(files);
  }

  /**
   * Returns the file extension of the file in input.
   * @param file File.
   * @returns File extension of the file in input.
   */
  getFileExtension(file: File): string {
    return this._fileTypeService.getFileExtensionFromFileName(file.name);
  }

  /**
   * Returns the file size formatted of the file in input.
   * @param file File.
   * @returns File size formatted of the file in input.
   */
  getFileSizeFormatted(file: File): string {
    return this._fileTypeService.formatFileSize(file.size);
  }

  /**
   * Returns the file extension of the file name in input.
   * @param file File.
   * @returns File extension of the file name in input.
   */
  getFileNameNoExtension(file: File): string {
    return this._fileTypeService.getFileNameNoExtension(file.name);
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
    this._renderer.setProperty(this.fileInput.nativeElement, 'value', null);
    const filteredList = this.filesList.filter(f => f.name !== file.name);
    this.applyChanges(filteredList);
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}
