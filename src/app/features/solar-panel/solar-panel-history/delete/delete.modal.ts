import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { TranslocoModule } from '@jsverse/transloco';
import {MatError, MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CustomValidators} from "../../../../shared/validators/custom.validators";

@Component({
  selector: 'app-view',
  templateUrl: './delete.modal.html',
  styleUrls: ['./delete.modal.scss'],
  imports: [
    CommonModule,
    TranslocoModule,

    MatDialogModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError
  ]
})
export class DeleteModal {
  private readonly dialogRef = inject(MatDialogRef<DeleteModal>);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly fb = inject(NonNullableFormBuilder);

  serialNumber: string = this.data.serialNumber;

  deleteForm = this.fb.group({
    serialNumber: ["", [
      Validators.required,
      CustomValidators.stringShouldMatch(this.serialNumber)
    ]],
  });

  confirm(): void {
    if (this.deleteForm.invalid) {
      return;
    }

    this.dialogRef.close(true);
  }

}
