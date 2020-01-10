import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.css']
})
export class CreateUserPageComponent implements OnInit {

  stompClient : SockJS;
  
  @Input() isShow : boolean;

  @Output() createAccountSuccess = new EventEmitter<string>();
  @Output() goToLoginEvent = new EventEmitter<boolean>();

  @ViewChild('createAccountPage', null) createAccountPage: ElementRef;
  @ViewChild('createAccountForm',null) createAccountForm: ElementRef;
  @ViewChild('email', null) emailinput: ElementRef;
  @ViewChild('username', null) usernameinput: ElementRef;
  @ViewChild('password', null) passwordinput: ElementRef;
  @ViewChild('repeatPw', null) repeatpwinput: ElementRef;
  @ViewChild('firstName', null) firstnameinput: ElementRef;
  @ViewChild('lastName', null) lastnameinput: ElementRef;



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
        stompClient.subscribe("/connect/createuser", function(frame) {_this.checkUserInfo(frame);});
      },
      function(error) {}
    );
  }

  public goToLogin() {
    this.isShow = true;
    this.goToLoginEvent.emit(false);
  }

  public tryCreateUser() {
    var email = this.emailinput.nativeElement.value.trim();
    var username = this.usernameinput.nativeElement.value.trim();
    var password = this.passwordinput.nativeElement.value;
    var repeatPw = this.repeatpwinput.nativeElement.value;
    var firstName = this.firstnameinput.nativeElement.value.trim();
    var lastName = this.lastnameinput.nativeElement.value.trim();

    if(email != null && username != null && password != null && password == repeatPw &&firstName != null && lastName != null){
      var newUser = {
        user_name : username,
        user_pwd : password,
        email : email,
        first_name : firstName,
        last_name : lastName
      };

      this.stompClient.send("/app/chat.register", {}, JSON.stringify(newUser));
    }
  }

  public checkUserInfo(payload){
    var user = JSON.parse(payload.body);
    if(user.user_name == null || user.user_pwd == null) {
      console.log("An error has occurred in saving your information, please try again.");
    }
    else {
      this.login(user.user_name);
    }
  }

  public login(name: string) {
    this.isShow = true;
    this.createAccountSuccess.emit(name);
    this.disconnect(this.stompClient);
  }

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
