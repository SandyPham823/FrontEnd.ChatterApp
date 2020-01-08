import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  chatPage = document.querySelector('#chat-page');
  messageForm = document.querySelector('#messageForm');
  messageInput = document.querySelector('#message');
  messageArea = document.querySelector('#messageArea');
  connectingElement = document.querySelector('.connecting');

  constructor() { }

  ngOnInit() {
  }

}
