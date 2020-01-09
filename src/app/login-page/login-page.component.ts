import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  stompClient : SockJS;

  usernamePage = document.querySelector('#username-page');

  @ViewChild('loginForm',null) usernameForm: ElementRef;
  @ViewChild('name', null) usernameinput: ElementRef;
  @ViewChild('password', null) passwordinput: ElementRef;


  constructor(private webSocketService : WebSocketServiceService) {
   }

  ngOnInit() {
    this.stompClient = this.webSocketService.getClient();
    if(this.stompClient.status != 'CONNECTED'){
      this.connect(this.stompClient);
    }
  }

  public connect(stompClient) {
    var _this = this;
    stompClient.connect({}, 
      function() {
        stompClient.subscribe("/connect/login", function() {_this.login;});
      },
      function(error) {
        alert( error );
      }
    );
  }

  public login() {
    var username = this.usernameinput.nativeElement.value.trim();
    var password = this.passwordinput.nativeElement.value;
    console.log("The username is: "+username);
    console.log("The password is: "+password);

  }

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
  
}
