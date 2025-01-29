import { NgModule } from '@angular/core';
import { AppModule } from '../app.module';
import { MaterialModule } from '../shared/material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  imports: [
    AppModule,
    MaterialModule,
    SidebarComponent,
    NavbarComponent
  ],
  exports: [SidebarComponent, NavbarComponent],
  providers: [],
})
export class ComponentModule {}
