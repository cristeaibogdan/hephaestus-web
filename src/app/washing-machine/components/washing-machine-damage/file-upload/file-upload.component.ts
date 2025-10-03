
import { Component, Input, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NotificationService } from 'src/app/services/notification.service';
import { DragAndDropDirective } from 'src/app/shared/directives/drag-and-drop.directive';
import { ImageFile } from 'src/app/washing-machine/models/image-file.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,

    // CommonModule, // for json pipe in html, used for debugging.

    TranslocoModule,
    DragAndDropDirective,
  ]
})
export class FileUploadComponent {
  @Input() selectedImages!: FormControl<ImageFile[]>;

  private _notifService = inject(NotificationService);
  private _translocoService = inject(TranslocoService);
  private sanitizer = inject(DomSanitizer);  

  onDrop(droppedFiles:FileList): void {
    this.processFiles(droppedFiles);
  }

  onFileUpload(event: any): void {
    // console.log(event);
    const htmlInput = event.target as HTMLInputElement;
    if(htmlInput.files) {
      this.processFiles(htmlInput.files);
    }
  }

  private processFiles(files: FileList): void {    
    // 1. Validate file length
    const totalFilesCount = this.selectedImages.value.length + files.length;
    if (totalFilesCount > 3) {
      this._notifService.showError(this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_LIMIT"),0);
      return;
    }
      
    for (let i = 0; i < files.length; i++) {
      const uploadedFile: File = files[i];      
      
      // 2. Validate file extension
      if(this.invalidFileExtension(uploadedFile.name)) {
        this._notifService.showError(
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_EXTENSION_TEXT"),0);
        return;
      }
      
      // 3. Validate file size, must not exceed 3 MB
      if(this.invalidFileSize(uploadedFile.size, 3)) {
        this._notifService.showError(
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_FILE")
          +" "+uploadedFile.name+" "+
          this._translocoService.translate("I18N.CUSTOM_ERROR.IMAGE_SIZE_TEXT"),0);
        return;
      }
            
      const imageFile: ImageFile = {
        file: uploadedFile,
        url: this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(uploadedFile)
        )
      }

      this.selectedImages.setValue([...this.selectedImages.value, imageFile]);
    }
  }

  onRemoveImage(index:number): void {
    this.selectedImages.value.splice(index, 1);
  }

//************************
//***** HELPER METHODS
//************************
  
  private invalidFileExtension(fileName: string): boolean {
    const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
  
    switch(extension.toLowerCase()) {
      case 'png': return false;  
      case 'jpg': return false;
      case 'jpeg': return false;
      case 'bmp': return false;

      default: return true;
    }
  }

  private invalidFileSize(fileSize:number, maxFileSizeInMB:number): boolean {
    const fileSizeInMB:number = fileSize / (1024 * 1024);
    return (fileSizeInMB < maxFileSizeInMB) 
      ? false 
      : true;
  }
}
