import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelCreatePage } from './solar-panel-create.page';
import {TranslocoTestingModule} from "@jsverse/transloco";

describe('SolarPanelCreatePage', () => {
  let component: SolarPanelCreatePage;
  let fixture: ComponentFixture<SolarPanelCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SolarPanelCreatePage,
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

    fixture = TestBed.createComponent(SolarPanelCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
