import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFrFormatReadable'
})
export class DateFrFormatReadablePipe implements PipeTransform {
  transform(value: string | Date | null): string {
    if (!value) return '';

    const date = new Date(value);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
}
