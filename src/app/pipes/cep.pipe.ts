import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep',
})
export class CepPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    let cep = value.toString().replace(/\D/g, '');

    return `${cep.substring(0, 5)}-${cep.substring(5)}`;
  }
}
