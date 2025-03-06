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
        this.visibleSurfacesForm.controls.hasScratches.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.hasDents.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.hasMinorDamage.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.hasMajorDamage.enable({emitEvent: false});
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

  toggleScratchesLength(): void {   
    const control = this.visibleSurfacesForm.controls.scratchesLength;
    const enabled = this.visibleSurfacesForm.controls.hasScratches.value;
    this.toggleControlState(control, enabled);
  }

  toggleDentsDepth(): void {
    const control = this.visibleSurfacesForm.controls.dentsDepth;
    const enabled = this.visibleSurfacesForm.controls.hasDents.value;
    this.toggleControlState(control, enabled);
  }

  toggleMinorDamage(): void {  
    const control = this.visibleSurfacesForm.controls.minorDamage;
    const enabled = this.visibleSurfacesForm.controls.hasMinorDamage.value;
    this.toggleControlState(control, enabled);
  }

  toggleMajorDamage(): void {
    const control = this.visibleSurfacesForm.controls.majorDamage;
    const enableWhen = this.visibleSurfacesForm.controls.hasMajorDamage.value;
    this.toggleControlState(control, enableWhen);
  }

}
