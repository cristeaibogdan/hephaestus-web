import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-visible-surfaces-form',  
  templateUrl: './visible-surfaces-form.component.html',
  styleUrl: './visible-surfaces-form.component.scss',
  imports: [
    MatFormFieldModule,    
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatInputModule,
    
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule
  ],
})
export class VisibleSurfacesFormComponent implements OnInit {
  @Input() applicableVisibleSurfacesDamage!: FormControl;
  @Input() visibleSurfacesForm!: FormGroup;
  private destroyRef = inject(DestroyRef);

  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;
  
  ngOnInit(): void {
    // 1. If false from the start, reset and disable visibleSurfacesForm
    if(!this.applicableVisibleSurfacesDamage.value) {
      this.visibleSurfacesForm.reset();
      this.visibleSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.applicableVisibleSurfacesDamage.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value=> {
      if(value) {
        this.visibleSurfacesForm.controls.visibleSurfacesHasScratches.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasDents.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        this.visibleSurfacesForm.reset();
        this.visibleSurfacesForm.disable({emitEvent: false});
      }
    });
  }
  
// **********************************
// *** DAMAGE TOGGLES
// **********************************

  toggleControlState(control: AbstractControl, enabled: boolean): void {
    if (enabled) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggle_VisibleSurfaces_ScratchesLength(): void {   
    const control = this.visibleSurfacesForm.controls.visibleSurfacesScratchesLength;
    const enabled = this.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value;
    this.toggleControlState(control, enabled);
  }

  toggle_VisibleSurfaces_DentsDepth(): void {
    const control = this.visibleSurfacesForm.controls.visibleSurfacesDentsDepth;
    const enabled = this.visibleSurfacesForm.controls.visibleSurfacesHasDents.value;
    this.toggleControlState(control, enabled);
  }

  toggle_VisibleSurfaces_MinorDamage(): void {  
    const control = this.visibleSurfacesForm.controls.visibleSurfacesMinorDamage;
    const enabled = this.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value;
    this.toggleControlState(control, enabled);
  }

  toggle_VisibleSurfaces_MajorDamage(): void {
    const control = this.visibleSurfacesForm.controls.visibleSurfacesMajorDamage;
    const enableWhen = this.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value;
    this.toggleControlState(control, enableWhen);
  }

}
