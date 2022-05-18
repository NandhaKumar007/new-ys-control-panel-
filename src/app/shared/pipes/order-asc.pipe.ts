import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderAsc'
})
export class OrderAscPipe implements PipeTransform {

  transform(array: any, args: string): any {
    if (array !== undefined) {
      array.sort((a: any, b: any) => {
        if ( a[args] < b[args] ){
          return -1;
        }else if( a[args] > b[args] ){
            return 1;
        }else{
          return 0;	
        }
      });
    }
    return array;
  }

}
