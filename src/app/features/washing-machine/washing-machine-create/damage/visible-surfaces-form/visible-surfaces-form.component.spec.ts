import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleSurfacesFormComponent } from './visible-surfaces-form.component';
import {TranslocoTestingModule} from "@jsverse/transloco";
import {FormControl, FormGroup} from "@angular/forms";

describe('VisibleSurfacesFormComponent', () => {
  let component: VisibleSurfacesFormComponent;
  let fixture: ComponentFixture<VisibleSurfacesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VisibleSurfacesFormComponent,
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

    fixture = TestBed.createComponent(VisibleSurfacesFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('applicableVisibleSurfacesDamage', new FormControl(true));
    fixture.componentRef.setInput('visibleSurfacesForm', new FormGroup({
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
