import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridComponent } from './grid/grid.component';
import { GridDemoRoutingModule } from './grid-demo-routing.module';
import { GridLayoutModule } from 'projects/grid-layout/src/public-api';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    CommonModule,
    GridDemoRoutingModule,
    GridLayoutModule,
    FormsModule
  ]
})
export class GridDemoModule { }
