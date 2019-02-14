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
  Renderer2
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileSelectorComponent),
      multi: true,
    },
  ]
})
export class FileSelectorComponent implements ControlValueAccessor, FileSelectorOptions {

  @Input() accept?: string;

  @Input() capture?: 'user' | 'environment';

  @Input() multiple?: boolean;

  @Input() inputId = `sbb-file-selector-${counter++}`;

  @Output() fileChanged = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;

  filesList: File[];

  fileTypeCategory = FileTypeCategory;

  onChange = (_: File[]) => { };
  onTouched = () => { };

  constructor(
    private _fileTypeService: FileSelectorTypesService,
    private _renderer: Renderer2,
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

  fileChange(files: FileList) {
    const arrayFiles: File[] = Array.from(files);
    this.applyChanges(arrayFiles);
  }

  applyChanges(files: File[]): void {
    this.onChange(files);
    this.writeValue(files);
    this.fileChanged.emit(files);
  }

  getFileExtension(file: File): string {
    return this._fileTypeService.getFileExtensionFromFileName(file.name);
  }

  getFileSizeFormatted(file: File): string {
    return this._fileTypeService.formatFileSize(file.size);
  }

  getFileNameNoExtension(file: File): string {
    return this._fileTypeService.getFileNameNoExtension(file.name);
  }

  getFileTypeCat(file: File): FileTypeCategory {
    return this._fileTypeService.getFileTypeCategoryByMimeType(file.type);
  }

  removeFile(file: File): void {
    this._renderer.setProperty(this.fileInput.nativeElement, 'value', null);
    const filteredList = this.filesList.filter(f => f.name !== file.name);
    this.applyChanges(filteredList);
  }
}
