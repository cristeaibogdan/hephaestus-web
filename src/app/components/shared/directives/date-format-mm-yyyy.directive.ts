import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const CUSTOM_FORMAT = {
  parse: {
    dateInput: 'MM-YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'MM-YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Directive({
  selector: '[dateFormat_MM-YYYY]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMAT }
  ]
})
export class DateFormatMMYYYYDirective {
  constructor() { }
}
