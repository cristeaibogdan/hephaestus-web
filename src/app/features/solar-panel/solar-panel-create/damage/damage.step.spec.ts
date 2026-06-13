import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageStep } from './damage.step';
import {provideRouter} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";
import {CdkStepper} from "@angular/cdk/stepper";
import {TranslocoTestingModule} from "@jsverse/transloco";

describe('DamageStep', () => {
  let component: DamageStep;
  let fixture: ComponentFixture<DamageStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DamageStep,
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ],
      providers: [
        // provideRouter([]),
        {
          provide: MatStepper,
          useValue: {}
        },
        {
          provide: CdkStepper,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamageStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
