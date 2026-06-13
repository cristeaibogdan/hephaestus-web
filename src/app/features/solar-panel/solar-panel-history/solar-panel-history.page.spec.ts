import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelHistoryPage } from './solar-panel-history.page';
import {TranslocoTestingModule} from "@jsverse/transloco";
import {provideNativeDateAdapter} from "@angular/material/core";

describe('SolarPanelHistoryPage', () => {
  let component: SolarPanelHistoryPage;
  let fixture: ComponentFixture<SolarPanelHistoryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SolarPanelHistoryPage,
        TranslocoTestingModule.forRoot({
          langs: { },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
          },
        })
      ],
      providers: [
        provideNativeDateAdapter()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
