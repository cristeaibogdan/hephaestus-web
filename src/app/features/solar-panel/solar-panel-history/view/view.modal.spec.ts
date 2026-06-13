import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModal } from './view.modal';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {TranslocoTestingModule} from "@jsverse/transloco";
import {Recommendation} from "../../recommendation.enum";

describe('ViewModal', () => {
  let component: ViewModal;
  let fixture: ComponentFixture<ViewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewModal,
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
          provide: MAT_DIALOG_DATA,
          useValue: {
            solarPanel: {
              category: "string",
              manufacturer: "string",
              model: "string",
              type: "string",
              serialNumber: "string",
              createdAt: Date.now(),
              recommendation: Recommendation.REPAIR
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
