import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gridSearch'
})

export class GridSearchPipe implements PipeTransform {

  transform(items: any, filter: any): any {

    if(!items) return [];
    else
    {
      let firstKey = Object.keys(filter)[0];
      if(filter[firstKey] && filter[firstKey]!=undefined)
      {
        if(filter && Array.isArray(items))
        {
          let filterKeys = Object.keys(filter);
          return items.filter(item => {
            return filterKeys.some((keyName) => {
              return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
            });
          });
        }
      }
      else return items;
    }

  }

}