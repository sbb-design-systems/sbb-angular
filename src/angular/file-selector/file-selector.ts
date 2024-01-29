// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  Optional,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { mixinDisabled } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import {
  FileTypeCategory,
  SbbFileSelectorOptions,
  SBB_FILE_SELECTOR_OPTIONS,
} from './file-selector-base';
import { SbbFileSelectorTypesService } from './file-selector-types.service';

let nextId = 0;

// Boilerplate for applying mixins to SbbFileSelector.
// tslint:disable-next-line: naming-convention
const _SbbFileSelectorMixinBase = mixinDisabled(
  class {
    constructor(public _elementRef: ElementRef) {}
  },
);

@Component({
  selector: 'sbb-file-selector',
  exportAs: 'sbbFileSelector',
  templateUrl: './file-selector.html',
  styleUrls: ['./file-selector.css'],
  host: {
    class: 'sbb-file-selector',
    '[attr.id]': 'this.id',
  },
  inputs: ['disabled'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbFileSelector),
      multi: true,
    },
  ],
  standalone: true,
  imports: [SbbIconModule],
})
export class SbbFileSelector
  extends _SbbFileSelectorMixinBase
  implements ControlValueAccessor, SbbFileSelectorOptions
{
  _labelUploadFile: string = $localize`:Button label to select files for upload@@sbbFileSelectorUploadFile:Upload file`;

  _labelRemoveFile: string = $localize`:Hidden button label to remove a file from the selection list@@sbbFileSelectorRemoveFile:Remove file`;

  private _uniqueId = `sbb-file-selector-${++nextId}`;

  /** Unique id of the element. */
  @Input() id: string = this._uniqueId;

  /** Id for the inner input field. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Categories of file types accepted by sbb-file-selector component. */
  @Input() accept?: string;
  /** Attribute whose state specifies the preferred facing mode for the media capture mechanism. */
  @Input() capture?: 'user' | 'environment';

  /** Mode on file selector component to chose more files to upload. */
  @Input({ transform: booleanAttribute })
  multiple: boolean = false;

  /** Set if the component should add files on top of the already selected ones or keep default input file behaviour. */
  @Input() multipleMode: 'default' | 'persistent' = 'default';

  /** Event emitted to a change on file selector component (for example the uploading of files). */
  @Output() fileChanged: EventEmitter<File[]> = new EventEmitter<File[]>();
  /** @docs-private */
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;

  /** List of files uploaded. */
  filesList: File[];

  /** Property that listens changes on file selector. */
  _onChange: (_: any) => void = (_) => {};

  /** Property that catches the interaction with user. */
  _onTouched: () => void = () => {};

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private _fileTypeService: SbbFileSelectorTypesService,
    private _renderer: Renderer2,
    private _changeDetector: ChangeDetectorRef,
    @Optional() @Inject(SBB_FILE_SELECTOR_OPTIONS) options: SbbFileSelectorOptions,
  ) {
    super(elementRef);
    if (options) {
      this.accept = options.accept;
      this.capture = options.capture;
      this.multiple = !!options.multiple;
      this.multipleMode = options.multipleMode || this.multipleMode;
    }
  }

  /**
   * Applies changes on the list of files uploaded.
   * @param files Files uploaded.
   */
  fileChange(files: FileList | Event) {
    if (!files) {
      return;
    }
    if (files instanceof FileList) {
      this.applyChanges(Array.from(files));
      return;
    }

    const target: HTMLInputElement | null = files.target as any;
    if (target && target.files) {
      this.applyChanges(Array.from(target.files));
    }
  }

  /**
   * Applies changes on sbb-file-selector.
   * @param files Files uploaded.
   * @param action add or remove
   */
  applyChanges(files: File[], action: 'add' | 'remove' = 'add'): void {
    const filesToAdd = action === 'add' ? this._getFileListByMode(files) : files;
    this._renderer.setProperty(this.fileInput.nativeElement, 'value', null);
    this._onChange(filesToAdd);
    this.writeValue(filesToAdd);
    this.fileChanged.emit(filesToAdd);
  }

  /**
   * Returns the list of files without the file deleted.
   * @param file File to delete.
   * @returns List of files without the file deleted.
   */
  removeFile(file: File): void {
    const filteredList = this.filesList.filter((f) => !this._checkFileEquality(f, file));
    this.applyChanges(filteredList, 'remove');
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any) {
    this.filesList = value;
    this._changeDetector.detectChanges();
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  /** Returns the file type category by the file type in input. */
  _resolveFileTypeCategory(file: File): FileTypeCategory {
    return this._fileTypeService.getFileTypeCategoryByMimeType(file.type);
  }

  /** Get the file name without the extension. */
  _fileNameNoExtension(file: File): string {
    return this._fileTypeService.removeFileExtension(file.name);
  }

  /** Get the file extension of the given file. */
  _fileExtension(file: File): string {
    return this._fileTypeService.fileExtension(file.name);
  }

  /** Returns the formatted file size of the given file. */
  _fileSizeFormatted(file: File): string {
    return this._fileTypeService.formatFileSize(file.size);
  }

  private _getFileListByMode(incomingFiles: File[]): File[] {
    if (this.multiple && this.multipleMode === 'persistent') {
      return incomingFiles
        .filter(
          (f) => this.filesList.findIndex((flItem) => this._checkFileEquality(f, flItem)) === -1,
        )
        .concat(this.filesList);
    }

    return incomingFiles;
  }

  private _checkFileEquality(file1: File, file2: File): boolean {
    return (
      file1.name === file2.name &&
      file1.size === file2.size &&
      file1.lastModified === file2.lastModified
    );
  }
}
