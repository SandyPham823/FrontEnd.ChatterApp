
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

  stompClient: SockJS;
  show: boolean;

  @Input() currentUser: string;
  currentChannel: string;

  colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

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
    if(name != undefined) {
      this.stompClient.send("/app/chat.getMessages", {}, JSON.stringify(name));
      this.currentChannel = name;
    }
  }

  @ViewChild('chatPage',null) chatPage: ElementRef;
  @ViewChild('messageForm',null) messageForm: ElementRef;
  @ViewChild('message',null) messageInput: ElementRef;
  @ViewChild('messageArea',null) messageArea: ElementRef;


  constructor(private webSocketService : WebSocketServiceService) { }

  ngOnInit() {
    console.log("----" + this.showNow + "----");
    console.log("This is: " + this);
  }

  public sendMessage() {
    var messageContent = this.messageInput.nativeElement.value.trim();
    if(messageContent && this.stompClient) {
        var chatMessage = {
            sender: this.currentUser,
            content: this.messageInput.nativeElement.value,
            type: 'CHAT',
            channel_name: this.currentChannel
        };
        console.log("Sending message");
        this.stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
        this.messageInput.nativeElement.value = '';
    }
  }

  public connect(stompClient: SockJS) {
    var _this = this;
    stompClient.connect({}, function(){
        _this.stompClient.subscribe("/topic/public", function(payload){_this.onMessageReceived(payload)});
        _this.stompClient.subscribe("/format/getMessages", function(payload){_this.getChannelMessages(payload)});
      },
      function(error) {}
    );
  }

  public onMessageReceived(payload) {
    console.log("onMessageReceived has been called");
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
    console.log("retrievingMessages has been called");
    var messageElement = document.createElement('li');
    messageElement.classList.add('chat-message');

    var avatarElement = document.createElement('i');
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = this.getAvatarColor(message.sender);

    messageElement.appendChild(avatarElement);

    var usernameElement = document.createElement('span');
    var usernameText = document.createTextNode(message.sender);
    usernameElement.appendChild(usernameText);
    messageElement.appendChild(usernameElement);

    var timestamp = document.createElement('time');
    timestamp.innerText = message.timestamp;
    messageElement.appendChild(timestamp);
        

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    this.messageArea.nativeElement.appendChild(messageElement);
    this.messageArea.nativeElement.scrollTop = this.messageArea.nativeElement.scrollHeight;
  }

  public getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % this.colors.length);
    return this.colors[index];
}

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
