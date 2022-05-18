import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listSearch'
})
export class ListSearchPipe implements PipeTransform {

  transform(items: any[], value : string): any[] {

    if (!items) return [];
    if (!value || value.length == 0) return items;

    let columns = [];
    if(items.length) columns = Object.keys(items[0]);
    if(!columns.length) return;

    return items.filter(function(d) {
      for(let i=0; i<=columns.length; i++) {
        const column = columns[i];
        if(d[column] && d[column].toString().toLowerCase().indexOf(value) > -1) return true;
      }
    });

  }

}
