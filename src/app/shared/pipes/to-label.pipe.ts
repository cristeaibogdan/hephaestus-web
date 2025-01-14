import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toLabel',
    standalone: true
})
export class ToLabelPipe implements PipeTransform {

  private readonly specialCases: Map<string, string> = new Map([
    ["QR_CODE", "QR Code"]
  ]);

  transform(value: string): string {
    if(!value) {
      return "";
    }

    const specialCaseLabel = this.specialCases.get(value);
    if (specialCaseLabel) {
      return specialCaseLabel;
    }

    return value
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
}
