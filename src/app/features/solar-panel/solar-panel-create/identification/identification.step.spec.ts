import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentificationStep } from './identification.step';
import {MatStepper} from "@angular/material/stepper";
import {TranslocoTestingModule} from "@jsverse/transloco";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";

describe('IdentificationStep', () => {
  let component: IdentificationStep;
  let fixture: ComponentFixture<IdentificationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        }),
        IdentificationStep,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: MatStepper,
          useValue: {}
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentificationStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
