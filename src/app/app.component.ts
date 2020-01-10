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
  public user: string;
  public changedChannel: string;
  public loginOrCreateUser: boolean;

  childEventClicked(name: string) {
    this.loggedIn = true;
    this.user = name;
  }  

  createUserEvent(name: string){
    this.loggedIn = true;
    this.user = name;
  }

  switchToLogin(){

  }

  switchToCreateUser(){

  }

  changeChannelClicked(channelName: string){
      this.changedChannel = channelName;
  }
}