import { Component, OnInit } from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  stompClient : SockJS;

  sideBar = document.querySelector('#sidebar');
  channelArea = document.querySelector("#channellist");


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
        stompClient.subscribe("/sidebar/channels", function() {this.login();});
      },
      function(error) {
        alert( error );
      }
    );
  }

}
