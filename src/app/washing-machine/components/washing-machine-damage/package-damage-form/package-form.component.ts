import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-package-form',
  imports: [
    MatFormFieldModule,    
    MatExpansionModule,
    MatCheckboxModule,
    
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule
  ],
  templateUrl: './package-form.component.html',
  styleUrl: './package-form.component.scss'
})
export class PackageFormComponent implements OnInit {
  @Input() applicablePackageDamage!: FormControl;
  @Input() packageForm!: FormGroup;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // 1. If false from the start, reset and disable packageForm
    if(!this.applicablePackageDamage.value) {
      this.packageForm.reset();
      this.packageForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.applicablePackageDamage.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value =>{
      if(value) {
        this.packageForm.enable({emitEvent: false});
        this.packageForm.controls.packageMaterialAvailable.disable();
      } else {
        this.packageForm.reset();
        this.packageForm.disable({emitEvent: false});
      }
    });

    // 3. If packageDamaged or packageDirty is true, enable packageMaterialAvailable
    this.packageForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      if(value.packageDamaged || value.packageDirty) {
        this.packageForm.controls.packageMaterialAvailable.enable({emitEvent: false});       
      } else {
        this.packageForm.controls.packageMaterialAvailable.setValue(false, {emitEvent: false});
        this.packageForm.controls.packageMaterialAvailable.disable({emitEvent: false}); 
      }
    });
  }
}
