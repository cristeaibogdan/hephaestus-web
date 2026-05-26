import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleSurfacesFormComponent } from './visible-surfaces-form.component';

describe('VisibleSurfacesFormComponent', () => {
  let component: VisibleSurfacesFormComponent;
  let fixture: ComponentFixture<VisibleSurfacesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisibleSurfacesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisibleSurfacesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
