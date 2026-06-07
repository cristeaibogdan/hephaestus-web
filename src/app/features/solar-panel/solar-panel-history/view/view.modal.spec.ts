import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModal } from './view.modal';

describe('SolarPanelHistoryViewComponent', () => {
  let component: ViewModal;
  let fixture: ComponentFixture<ViewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewModal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
