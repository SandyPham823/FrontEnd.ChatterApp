import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  stompClient : SockJS;
  isShow: boolean = false;

  @Output() loginSuccess = new EventEmitter<string>();

  @ViewChild('loginPage', null) loginPage: ElementRef;
  @ViewChild('loginForm',null) usernameForm: ElementRef;
  @ViewChild('name', null) usernameinput: ElementRef;
  @ViewChild('password', null) passwordinput: ElementRef;


  constructor(private webSocketService : WebSocketServiceService) {}

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
        stompClient.subscribe("/connect/login", function(frame) {_this.checkUserInfo(frame);});
      },
      function(error) {}
    );
  }

  public tryLogin() {
    var username = this.usernameinput.nativeElement.value.trim();
    var password = this.passwordinput.nativeElement.value;
    this.stompClient.send('/app/chat.login', {}, JSON.stringify({USER_NAME: username, USER_PWD: password}));
  }

  public checkUserInfo(payload) {
    var userInfo = JSON.parse(payload.body);
    if(userInfo.user_NAME == null || userInfo.user_PWD == null) {
      console.log("incorrect login information");
    }
    else {
      console.log("logging in");
      console.log("Welcome, " + userInfo.user_NAME);
      this.isShow = true;
      this.loginSuccess.emit(userInfo.user_NAME);
      this.disconnect(this.stompClient);
    }
  }

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
