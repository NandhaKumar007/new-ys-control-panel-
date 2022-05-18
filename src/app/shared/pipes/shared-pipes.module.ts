import { NgModule } from '@angular/core';
import { FieldSearchPipe } from './field-search.pipe';
import { GridSearchPipe } from './grid-search.pipe';
import { ListSearchPipe } from './list-search.pipe';
import { OrderAscPipe } from './order-asc.pipe';
import { OrderDescPipe } from './order-desc.pipe';
import { ProductFilterPipe } from './product-filter.pipe';

const pipes = [
  FieldSearchPipe,
  GridSearchPipe,
  ListSearchPipe,
  OrderAscPipe,
  OrderDescPipe,
  ProductFilterPipe
];

@NgModule({
  imports: [],
  declarations: pipes,
  exports: pipes
})

export class SharedPipesModule { }