import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializationFailedPage } from './initialization-failed.page';
import {provideRouter} from "@angular/router";

describe('InitializationFailedPage', () => {
  let component: InitializationFailedPage;
  let fixture: ComponentFixture<InitializationFailedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InitializationFailedPage ],
      providers: [
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitializationFailedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
