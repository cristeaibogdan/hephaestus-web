import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponent } from './file-upload.component';
import {TranslocoTestingModule} from "@jsverse/transloco";

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FileUploadComponent,
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedImages', []);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
