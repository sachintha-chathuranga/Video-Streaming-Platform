import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclaimPipe',
  standalone: true
})
export class ExclaimPipePipe implements PipeTransform {

  transform(value: string): string {
    return value+'!';
  }

}
