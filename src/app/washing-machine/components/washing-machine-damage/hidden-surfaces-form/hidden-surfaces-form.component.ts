
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-hidden-surfaces-form',  
  templateUrl: './hidden-surfaces-form.component.html',
  styleUrl: './hidden-surfaces-form.component.scss',
  imports: [
    MatFormFieldModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSliderModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslocoModule
],
})
export class HiddenSurfacesFormComponent implements OnInit {
  @Input() applicableHiddenSurfacesDamage!: FormControl;
  @Input() hiddenSurfacesForm!: FormGroup;
  private destroyRef = inject(DestroyRef);

  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;

  ngOnInit(): void {
    // If false from the start, reset and disable hiddenSurfacesForm
    if(!this.applicableHiddenSurfacesDamage.value) {
      this.hiddenSurfacesForm.reset();
      this.hiddenSurfacesForm.disable({emitEvent: false});
    }

    this.toggleHiddenSurfacesFormBasedOnApplicableHiddenSurfacesDamage();
  }

  private toggleHiddenSurfacesFormBasedOnApplicableHiddenSurfacesDamage() {
    this.applicableHiddenSurfacesDamage.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value) {
          this.hiddenSurfacesForm.controls.hasScratches.enable({ emitEvent: false });
          this.hiddenSurfacesForm.controls.hasDents.enable({ emitEvent: false });
          this.hiddenSurfacesForm.controls.hasMinorDamage.enable({ emitEvent: false });
          this.hiddenSurfacesForm.controls.hasMajorDamage.enable({ emitEvent: false });
        } else {
          this.hiddenSurfacesForm.reset();
          this.hiddenSurfacesForm.disable({ emitEvent: false });
        }
      });
  }

// ********************************
// *** DAMAGE TOGGLES
// *********************************

  toggleControlState(control: AbstractControl, enabled: boolean): void {
    if (enabled) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggleScratchesLength(): void {
    const control = this.hiddenSurfacesForm.controls.scratchesLength;
    const enabled = this.hiddenSurfacesForm.controls.hasScratches.value;
    this.toggleControlState(control, enabled);
  }

  toggleDentsDepth(): void {  
    const control = this.hiddenSurfacesForm.controls.dentsDepth;
    const enabled = this.hiddenSurfacesForm.controls.hasDents.value;
    this.toggleControlState(control, enabled);
  }

  toggleMinorDamage(): void {
    const control = this.hiddenSurfacesForm.controls.minorDamage;
    const enabled = this.hiddenSurfacesForm.controls.hasMinorDamage.value;
    this.toggleControlState(control, enabled);
  }

  toggleMajorDamage(): void {  
    const control = this.hiddenSurfacesForm.controls.majorDamage;
    const enabled = this.hiddenSurfacesForm.controls.hasMajorDamage.value;
    this.toggleControlState(control, enabled);
  }

}
