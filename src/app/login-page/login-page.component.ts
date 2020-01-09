import { Component, OnInit } from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  stompClient : SockJS;

  constructor(private webSocketService : WebSocketServiceService) { }

  ngOnInit() {
    this.stompClient = this.webSocketService.getClient();
    if(this.stompClient.status != 'CONNECTED'){
      this.connect(this.stompClient);
    }
  }

  public connect(stompClient) {
    stompClient.connect({}, 
      function() {
        stompClient.subscribe("/connect/login", function() {this.login;});
      },
      function(error) {
        alert( error );
      }
    );
  }

  public login() {
    
  }

}
