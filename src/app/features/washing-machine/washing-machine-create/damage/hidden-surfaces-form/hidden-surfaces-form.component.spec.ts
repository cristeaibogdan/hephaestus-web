import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSurfacesFormComponent } from './hidden-surfaces-form.component';
import {TranslocoTestingModule} from "@jsverse/transloco";
import {FormControl, FormGroup} from "@angular/forms";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('HiddenSurfacesForm', () => {
  let component: HiddenSurfacesFormComponent;
  let fixture: ComponentFixture<HiddenSurfacesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HiddenSurfacesFormComponent,
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

    fixture = TestBed.createComponent(HiddenSurfacesFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('applicableHiddenSurfacesDamage', new FormControl(true));
    fixture.componentRef.setInput('hiddenSurfacesForm', new FormGroup({
      hasScratches: new FormControl(false),
      scratchesLength: new FormControl(0),
      hasDents: new FormControl(false),
      dentsDepth: new FormControl(0),
      hasMinorDamage: new FormControl(false),
      minorDamage: new FormControl(''),
      hasMajorDamage: new FormControl(false),
      majorDamage: new FormControl('')
    }));
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
