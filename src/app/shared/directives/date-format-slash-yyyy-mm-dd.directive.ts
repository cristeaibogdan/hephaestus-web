import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const CUSTOM_FORMAT = {
  parse: {
    dateInput: 'yyyy/MM/dd', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'yyyy/MM/dd', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};

@Directive({
  selector: '[dateFormat_slash_YYYY-MM-DD]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMAT }
  ]
})
export class DateFormatSlashYYYYMMDDDirective {
  constructor() { }
}
