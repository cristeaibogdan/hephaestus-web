import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnDestroy, OnInit, inject } from '@angular/core';
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
    
    CommonModule,
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
    // 1. If false from the start, reset and disable hiddenSurfacesForm
    if(!this.applicableHiddenSurfacesDamage.value) {
      this.hiddenSurfacesForm.reset();
      this.hiddenSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.applicableHiddenSurfacesDamage.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value=> {
      if(value) {
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        this.hiddenSurfacesForm.reset();
        this.hiddenSurfacesForm.disable({emitEvent: false});
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

  toggle_HiddenSurfaces_ScratchesLength(): void {
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength;
    const enabled = this.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value;
    this.toggleControlState(control, enabled);
  }

  toggle_HiddenSurfaces_DentsDepth(): void {  
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth;
    const enabled = this.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value;
    this.toggleControlState(control, enabled);
  }

  toggle_HiddenSurfaces_MinorDamage(): void {
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage;
    const enabled = this.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value;
    this.toggleControlState(control, enabled);
  }

  toggle_HiddenSurfaces_MajorDamage(): void {  
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage;
    const enabled = this.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value;
    this.toggleControlState(control, enabled);
  }

}
