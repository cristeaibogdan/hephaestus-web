import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewStep } from './overview.step';
import {provideRouter} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";
import {CdkStepper} from "@angular/cdk/stepper";
import {TranslocoTestingModule} from "@jsverse/transloco";

describe('OverviewStep', () => {
  let component: OverviewStep;
  let fixture: ComponentFixture<OverviewStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OverviewStep,
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ],
      providers: [
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

    fixture = TestBed.createComponent(OverviewStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
