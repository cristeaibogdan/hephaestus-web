import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenSurfacesFormComponent } from './hidden-surfaces-form.component';

describe('HiddenSurfacesFormComponent', () => {
  let component: HiddenSurfacesFormComponent;
  let fixture: ComponentFixture<HiddenSurfacesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiddenSurfacesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiddenSurfacesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
