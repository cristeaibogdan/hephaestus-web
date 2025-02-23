import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoModule } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

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
export class PackageFormComponent implements OnInit, OnDestroy {
  @Input() applicablePackageDamage!: FormControl;
  @Input() packageForm!: FormGroup;

  private subscriptions:Subscription[] = [];

  ngOnInit(): void {
    // 1. If false from the start, reset and disable packageForm
    if(!this.applicablePackageDamage.value) {
      this.packageForm.reset();
      this.packageForm.disable({emitEvent: false});
    }

    // 2. On every value change enable, reset and disable accordingly
    this.subscriptions.push(this.applicablePackageDamage.valueChanges.subscribe(value =>{      
      if(value) {
        this.packageForm.enable({emitEvent: false});
        this.packageForm.controls.packageMaterialAvailable.disable();
      } else {
        this.packageForm.reset();
        this.packageForm.disable({emitEvent: false});
      }
    })
    );

    // 3. If packageDamaged or packageDirty is true, enable packageMaterialAvailable
    this.subscriptions.push(this.packageForm.valueChanges.subscribe(value => {
      if(value.packageDamaged || value.packageDirty) {
        this.packageForm.controls.packageMaterialAvailable.enable({emitEvent: false});       
      } else {
        this.packageForm.controls.packageMaterialAvailable.setValue(false, {emitEvent: false});
        this.packageForm.controls.packageMaterialAvailable.disable({emitEvent: false}); 
      }
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
