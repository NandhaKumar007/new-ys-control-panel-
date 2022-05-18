import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'addons', loadChildren: () => import('./addons/addons.module').then(m => m.AddonsModule), canActivate: [PermissionGuard], data: { name: "addons" } },
  { path: 'archive', loadChildren: () => import('./archive/archive.module').then(m => m.ArchiveModule), canActivate: [PermissionGuard], data: { name: "product_archive" } },
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule), canActivate: [PermissionGuard], data: { name: "faq" } },
  { path: 'footnote', loadChildren: () => import('./foot-note/foot-note.module').then(m => m.FootNoteModule), canActivate: [PermissionGuard], data: { name: "foot_note" } },
  { path: 'measurement-sets', loadChildren: () => import('./measurements/measurements.module').then(m => m.MeasurementsModule), canActivate: [PermissionGuard], data: { name: "measurements" } },
  { path: 'shop-assistant', loadChildren: () => import('./shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule), canActivate: [PermissionGuard], data: { name: "shopping_assistant" } },
  { path: 'shop-assistant/:type', loadChildren: () => import('./shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule), canActivate: [PermissionGuard], data: { name: "shopping_assistant" } },
  { path: 'sizing-assistant', loadChildren: () => import('./sizing-assistant/sizing-assistant.module').then(m => m.SizingAssistantModule), canActivate: [PermissionGuard], data: { name: "sizing_assistant" } },
  { path: 'size-chart', loadChildren: () => import('./size-chart/size-chart.module').then(m => m.SizeChartModule), canActivate: [PermissionGuard], data: { name: "size_chart" } },
  { path: 'tags', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule), canActivate: [PermissionGuard], data: { name: "tags" } },
  { path: 'tax-rates', loadChildren: () => import('./tax-rates/tax-rates.module').then(m => m.TaxRatesModule), canActivate: [PermissionGuard], data: { name: "tax_rates" } },
  { path: 'product-taxonomy', loadChildren: () => import('./product-taxonomy/product-taxonomy.module').then(m => m.ProductTaxonomyModule), canActivate: [PermissionGuard], data: { name: "product_taxonomy" } },
  { path: 'variant-colors', loadChildren: () => import('./colors/colors.module').then(m => m.ColorsModule), canActivate: [PermissionGuard], data: { name: "variant_colors" } },
  { path: 'amenities', loadChildren: () => import('./amenities/amenities.module').then(m => m.AmenitiesModule), canActivate: [PermissionGuard], data: { name: "amenities" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductExtrasRoutingModule { }