import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-pricing-form',
  templateUrl: './pricing-form.component.html',
  styleUrl: './pricing-form.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule
  ],
})
export class PricingFormComponent {
  @Input() washingMachinePricingForm!: FormGroup;
}