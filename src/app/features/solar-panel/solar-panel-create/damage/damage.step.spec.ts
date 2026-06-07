import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageStep } from './damage.step';

describe('SolarPanelDamageComponent', () => {
  let component: DamageStep;
  let fixture: ComponentFixture<DamageStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageStep ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamageStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
