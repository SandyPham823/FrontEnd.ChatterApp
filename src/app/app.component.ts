import { Component, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';
import { EventEmitter } from 'events';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  
  ngOnInit() {
  }

  public loggedIn : boolean = false;
  public changedChannel: string;

  childEventClicked(event: Event) {
    console.log("event moving through parent.")
    console.log(event);
    console.log("LoggedIn: "+this.loggedIn);
    this.loggedIn = true;
    console.log("LoggedIn: "+this.loggedIn);
  }  

  changeChannelClicked(channelName: string){
      this.changedChannel = channelName;
  }
}