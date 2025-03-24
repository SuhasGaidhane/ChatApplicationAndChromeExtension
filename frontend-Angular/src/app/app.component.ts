import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TasksProjects';

  selectedTab: string = 'task1';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
