
import {Component, OnInit, Input, ViewChild, ElementRef, ViewChildren} from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  savedThis: ChatPageComponent = this;
  stompClient: SockJS;
  show: boolean;


  @Input()
  public set showNow(bool: boolean) {
    this.show = bool;
    console.log("////" + this.show + "////");
    console.log("This is: " + this);
    console.log("//////////////////");
    this.stompClient = this.webSocketService.getClient();
    if(this.stompClient.status != 'CONNECTED') {
      this.connect(this.stompClient);
    }
  }

  @Input()
  public set changeChannel(name: string) {
    console.log("This is: " + this);
    console.log("//////////////////");
    this.stompClient.send("/app/chat.getMessages", {}, JSON.stringify(name));
    console.log("This is: " + this);
    console.log("//////////////////");
  }

  @ViewChild('chatPage',null) chatPage: ElementRef;
  @ViewChild('messageForm',null) messageForm: ElementRef;
  @ViewChild('message',null) messageInput: ElementRef;
  @ViewChild('messageArea',null) messageArea: ElementRef;
  @ViewChild('.connecting', null) connectingElement: ElementRef;


  constructor(private webSocketService : WebSocketServiceService) { }

  ngOnInit() {
    console.log("----" + this.showNow + "----");
    console.log("This is: " + this);
  }

  public checkThis() {
    console.log(this);
  }

  public connect(stompClient: SockJS) {
    var _this = this;
    stompClient.connect({}, function(){
        _this.stompClient.subscribe("/topic/public", function(frame){_this.onMessageReceived(frame)});
        _this.stompClient.subscribe("/format/getMessages", function(frame){_this.getChannelMessages(frame)});
      },
      function(error) {
        alert( error );
      }
    );
    console.log("This is: " + this);
  }

  public onMessageReceived(payload){
    var message = JSON.parse(payload.body);
    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);



        var timestamp = document.createElement('time');
        timestamp.innerText = message.timestamp;
        messageElement.appendChild(timestamp);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    this.messageArea.nativeElement.appendChild(messageElement);
    this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
  }

  public getChannelMessages(payload) {
    console.log("This is: " + this);
    while(this.messageArea.nativeElement.firstChild) {
      this.messageArea.nativeElement.removeChild(this.messageArea.nativeElement.firstChild);
    }
    var channelMessages = JSON.parse(payload.body);
    console.log(channelMessages.length);
    for(var i = 0; i < channelMessages.length; i++) {
        var currentMessage = channelMessages[i];
        this.retrievingMessages(currentMessage);
    }
  }

  public retrievingMessages (message) {
    console.log(message);
    // console.log("RETRIEVING MESSAGES IN JAVASCRIPT");
    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        // avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);



        var timestamp = document.createElement('time');
        timestamp.innerText = message.timestamp;
        messageElement.appendChild(timestamp);

    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    this.messageArea.nativeElement.appendChild(messageElement);
    this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
}

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
