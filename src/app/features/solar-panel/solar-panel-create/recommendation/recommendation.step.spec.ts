import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationStep } from './recommendation.step';
import {MatStepper} from "@angular/material/stepper";
import {TranslocoTestingModule} from "@jsverse/transloco";
import {provideRouter} from "@angular/router";
import {CdkStepper} from "@angular/cdk/stepper";

describe('RecommendationStep', () => {
  let component: RecommendationStep;
  let fixture: ComponentFixture<RecommendationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecommendationStep,
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ],
      providers: [
        provideRouter([]),
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

    fixture = TestBed.createComponent(RecommendationStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
