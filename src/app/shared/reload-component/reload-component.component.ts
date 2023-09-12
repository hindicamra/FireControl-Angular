import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reload-component',
  templateUrl: './reload-component.component.html',
  styleUrls: ['./reload-component.component.css']
})
export class ReloadComponentComponent {
  test!: string;
  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if(navigation!=null)
    {
      const state = navigation.extras.state as {
        url: string;
        workQueue: boolean;
        services: number;
        code: string;
      };
      this.test = 'url:' + state.url;
      //console.log(this.test);
      this.router.navigateByUrl(state.url);
    }
  }
}
