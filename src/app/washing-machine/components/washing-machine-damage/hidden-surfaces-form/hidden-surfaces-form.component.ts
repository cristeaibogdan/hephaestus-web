import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

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
export class HiddenSurfacesFormComponent implements OnInit, OnDestroy {
  @Input() applicableHiddenSurfacesDamage!: FormControl;
  @Input() hiddenSurfacesForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;

  ngOnInit(): void {
    // 1. If false from the start, reset and disable hiddenSurfacesForm
    if(!this.applicableHiddenSurfacesDamage.value) {
      this.hiddenSurfacesForm.reset();
      this.hiddenSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(this.applicableHiddenSurfacesDamage.valueChanges.subscribe(value=> {
      if(value) {
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.enable({emitEvent: false});
        this.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        this.hiddenSurfacesForm.reset();
        this.hiddenSurfacesForm.disable({emitEvent: false});
      }
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

// ********************************
// *** DAMAGE TOGGLES
// *********************************

  toggleFormControl(control: AbstractControl, enableWhen: boolean): void {
    if (enableWhen) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggle_HiddenSurfaces_ScratchesLength(): void {
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesScratchesLength;
    const enableWhen = this.hiddenSurfacesForm.controls.hiddenSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_DentsDepth(): void {  
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesDentsDepth;
    const enableWhen = this.hiddenSurfacesForm.controls.hiddenSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MinorDamage(): void {
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesMinorDamage;
    const enableWhen = this.hiddenSurfacesForm.controls.hiddenSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_HiddenSurfaces_MajorDamage(): void {  
    const control = this.hiddenSurfacesForm.controls.hiddenSurfacesMajorDamage;
    const enableWhen = this.hiddenSurfacesForm.controls.hiddenSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

}
