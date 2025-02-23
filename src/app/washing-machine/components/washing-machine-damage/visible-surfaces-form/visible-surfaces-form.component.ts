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
export class VisibleSurfacesFormComponent implements OnInit, OnDestroy {
  @Input() applicableVisibleSurfacesDamage!: FormControl;
  @Input() visibleSurfacesForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  minorDamageDescriptionCharacterLimit:number = 200;
  majorDamageDescriptionCharacterLimit:number = 200;
  
  ngOnInit(): void {
    // 1. If false from the start, reset and disable visibleSurfacesForm
    if(!this.applicableVisibleSurfacesDamage.value) {
      this.visibleSurfacesForm.reset();
      this.visibleSurfacesForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(this.applicableVisibleSurfacesDamage.valueChanges.subscribe(value=> {
      if(value) {
        this.visibleSurfacesForm.controls.visibleSurfacesHasScratches.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasDents.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.enable({emitEvent: false});
        this.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.enable({emitEvent: false});
      } else {
        this.visibleSurfacesForm.reset();
        this.visibleSurfacesForm.disable({emitEvent: false});
      }
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

// **********************************
// *** DAMAGE TOGGLES
// **********************************

  toggleFormControl(control: AbstractControl, enableWhen: boolean): void {
    if (enableWhen) {
      control.enable({ emitEvent: false });
    } else {
      control.reset();
      control.disable({ emitEvent: false });
    }
  }

  toggle_VisibleSurfaces_ScratchesLength(): void {   
    const control = this.visibleSurfacesForm.controls.visibleSurfacesScratchesLength;
    const enableWhen = this.visibleSurfacesForm.controls.visibleSurfacesHasScratches.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_DentsDepth(): void {
    const control = this.visibleSurfacesForm.controls.visibleSurfacesDentsDepth;
    const enableWhen = this.visibleSurfacesForm.controls.visibleSurfacesHasDents.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MinorDamage(): void {  
    const control = this.visibleSurfacesForm.controls.visibleSurfacesMinorDamage;
    const enableWhen = this.visibleSurfacesForm.controls.visibleSurfacesHasMinorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

  toggle_VisibleSurfaces_MajorDamage(): void {
    const control = this.visibleSurfacesForm.controls.visibleSurfacesMajorDamage;
    const enableWhen = this.visibleSurfacesForm.controls.visibleSurfacesHasMajorDamage.value;
    this.toggleFormControl(control, enableWhen);
  }

}
