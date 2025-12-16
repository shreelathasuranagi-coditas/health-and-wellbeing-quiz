import { Component } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Sidebar } from "../../shared/components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, Sidebar, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
