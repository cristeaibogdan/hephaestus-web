import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitializationFailedPage } from './initialization-failed.page';

describe('InitializationFailedPage', () => {
  let component: InitializationFailedPage;
  let fixture: ComponentFixture<InitializationFailedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitializationFailedPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitializationFailedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
