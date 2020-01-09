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
    if(this.stompClient.status != 'CONNECTED'){
      this.connect(this.stompClient);
    }
  }

  public connect(stompClient) {
    stompClient.connect({}, 
      function() {
        stompClient.subscribe("/topic/public", function() {this.onMessageReceived;});
        stompClient.subscribe("/format/getMessages", function() {this.getChannelMessages;});
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
        messageElement.appendChild(timestamp)

    }
  }


  public getChannelMessages(payload){

  }
}
