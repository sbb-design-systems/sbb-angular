import {
  Component,
  Inject,
  Input,
  Optional,
  ChangeDetectionStrategy,
  forwardRef,
  Output,
  EventEmitter
} from '@angular/core';
import { FileSelectorOptions, FILE_SELECTOR_OPTIONS } from './file-selector-base';
import { FileSelectorTypesService } from './file-selector-types.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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

  @Output() fileChanged = new EventEmitter<FileList>();

  filesList: FileList;

  onChange = (_: FileList) => { };
  onTouched = () => { };

  constructor(
    private _fileTypeService: FileSelectorTypesService,
    @Optional() @Inject(FILE_SELECTOR_OPTIONS) options: FileSelectorOptions
  ) {
    if (options) {
      this.accept = options.accept;
      this.capture = options.capture;
      this.multiple = options.multiple;
    }
  }

  writeValue(filesList: FileList) { this.filesList = filesList; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }

  fileChange(files: FileList) {
    console.log(files);
    this.onChange(files);
    this.writeValue(files);
    this.fileChanged.emit(files);
  }

  getFileExtension(file: File): string {
    return this._fileTypeService.getFileExtensionFromFileName(file.name);
  }
}
