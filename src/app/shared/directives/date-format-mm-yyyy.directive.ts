import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

const CUSTOM_FORMAT = {
  parse: {
    dateInput: 'MM-yyyy', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'MM-yyyy', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy'
  }
};

@Directive({
    selector: '[dateFormat_MM-YYYY]',
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMAT }
    ],
    standalone: true
})
export class DateFormatMMYYYYDirective {
  constructor() { }
}
