import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingFormComponent } from './pricing-form.component';
import {TranslocoTestingModule} from "@jsverse/transloco";
import {FormControl, FormGroup} from "@angular/forms";

describe('PricingFormComponent', () => {
  let component: PricingFormComponent;
  let fixture: ComponentFixture<PricingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PricingFormComponent,
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

    fixture = TestBed.createComponent(PricingFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('washingMachinePricingForm', new FormGroup({
      price: new FormControl(0),
      repairPrice: new FormControl(0),
    }));
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
