import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrafficLightComponent } from './component/traffic-light/traffic-light.component';
import { RoleComponent } from './component/role/role.component';
import { ArenaComponent } from './page/arena/arena.component';
import { RoleTeamComponent } from './component/role-team/role-team.component';

@NgModule({
  declarations: [
    AppComponent,
    TrafficLightComponent,
    RoleComponent,
    ArenaComponent,
    RoleTeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
