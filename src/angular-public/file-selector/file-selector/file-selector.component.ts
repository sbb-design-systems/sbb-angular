import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
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

import {
  FileTypeCategory,
  SbbFileSelectorOptions,
  SBB_FILE_SELECTOR_OPTIONS,
} from './file-selector-base';
import { SbbFileSelectorTypesService } from './file-selector-types.service';

let nextId = 0;

@Component({
  selector: 'sbb-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbFileSelector),
      multi: true,
    },
  ],
  host: {
    class: 'sbb-file-selector',
    '[attr.id]': 'this.id',
  },
})
export class SbbFileSelector implements ControlValueAccessor, SbbFileSelectorOptions {
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
  @Input()
  get multiple() {
    return this._multiple;
  }
  set multiple(value: any) {
    this._multiple = coerceBooleanProperty(value);
  }
  private _multiple = false;

  /** Set if the component should add files on top of the already selected ones or keep default input file behaviour. */
  @Input() multipleMode: 'default' | 'persistent' = 'default';

  /** Mode to disable the choice of files to upload. */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

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
    private _fileTypeService: SbbFileSelectorTypesService,
    private _renderer: Renderer2,
    private _changeDetector: ChangeDetectorRef,
    @Optional() @Inject(SBB_FILE_SELECTOR_OPTIONS) options: SbbFileSelectorOptions
  ) {
    if (options) {
      this.accept = options.accept;
      this.capture = options.capture;
      this.multiple = options.multiple;
      this.multipleMode = options.multipleMode || this.multipleMode;
    }
  }

  writeValue(value: any) {
    this.filesList = value;
    this._changeDetector.detectChanges();
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
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
    const filteredList = this.filesList.filter((f) => !this._checkFileEquality(f, file));
    this.applyChanges(filteredList, 'remove');
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  private _getFileListByMode(incomingFiles: File[]): File[] {
    if (this.multiple && this.multipleMode === 'persistent') {
      return incomingFiles
        .filter((f) => {
          return this.filesList.findIndex((flItem) => this._checkFileEquality(f, flItem)) === -1;
        })
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

  // tslint:disable: member-ordering
  static ngAcceptInputType_capture: 'user' | 'environment' | string | null | undefined;
  static ngAcceptInputType_multipleMode: 'default' | 'persistent' | string | null | undefined;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_multiple: BooleanInput;
  // tslint:enable: member-ordering
}
