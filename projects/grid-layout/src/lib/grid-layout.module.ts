import { NgModule } from '@angular/core';
import { GridLayoutComponent } from './grid/grid-layout.component';
import { GridItemComponent } from '../public-api';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    GridLayoutComponent,
    GridItemComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GridLayoutComponent,
    GridItemComponent
  ]
})
export class GridLayoutModule { }
