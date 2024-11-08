import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toLabel'})
export class ToLabelPipe implements PipeTransform {

  private readonly specialCases: { [key: string]: string } = {
    'QR_CODE': 'QR Code',
  };

  transform(value: string): string {
    if(!value) {
      return "";
    }

    if (this.specialCases[value]) {
      return this.specialCases[value];
    }

    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}
