import { Component, OnInit } from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';

 
@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  stompClient: SockJS;

  chatPage = document.querySelector('#chat-page');
  messageForm = document.querySelector('#messageForm');
  messageInput = document.querySelector('#message');
  messageArea = document.querySelector('#messageArea');
  connectingElement = document.querySelector('.connecting');


  constructor(private webSocketService : WebSocketServiceService) { }

  ngOnInit() {
    this.stompClient = this.webSocketService.getClient();
    if(this.stompClient.status != 'CONNECTED') {
      this.connect(this.stompClient);
    }
  }

  public connect(stompClient: SockJS) {
    var _this = this;
    stompClient.connect({}, function(){
        _this.stompClient.subscribe("/topic/public", _this.onMessageReceived);
        _this.stompClient.subscribe("/format/getMessages", _this.getChannelMessages);
      },
      function(error) {
        alert( error );
      }
    );
  }

  public onMessageReceived(payload){
    var message = JSON.parse(payload.body);

    console.log(message);

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

    this.messageArea.appendChild(messageElement);
    this.messageArea.scrollTop = this.messageArea.scrollHeight;
  }

  public getChannelMessages(payload){
    var channelMessages = JSON.parse(payload.body);
    console.log(channelMessages.length);
    for(var i = channelMessages.length - 1; i >= 0; i--) {
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

    this.messageArea.appendChild(messageElement);
    this.messageArea.scrollTop = this.messageArea.scrollHeight;
}

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
