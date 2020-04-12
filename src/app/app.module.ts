import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrafficLightComponent } from './component/traffic-light/traffic-light.component';
import { RoleComponent } from './component/role/role.component';
import { ArenaComponent } from './page/arena/arena.component';

@NgModule({
  declarations: [
    AppComponent,
    TrafficLightComponent,
    RoleComponent,
    ArenaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
