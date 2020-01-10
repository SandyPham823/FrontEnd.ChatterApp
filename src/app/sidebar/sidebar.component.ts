import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {WebSocketServiceService} from '../web-socket-service.service';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  stompClient : SockJS;
  public show : boolean;

  channels: any[] = []

  @ViewChild('sidebar', null) sidebar: ElementRef;
  @ViewChild('channelList', null) channelArea: ElementRef;
  
  @Input() 
  public set showNow(bool: boolean) {
    this.show = bool;
    if(bool){
      this.stompClient.send("/app/chat.channels");
    }
  }

  @Output()changeChannel : EventEmitter<string> = new EventEmitter();


  constructor(private webSocketService : WebSocketServiceService) {
  }

  ngOnInit() {
    this.stompClient = this.webSocketService.getClient();
      if(this.stompClient.status != 'CONNECTED') {
        this.connect();
      }
  }

  public connect() {
    var _this = this;
    _this.stompClient.connect({}, 
      function() {
        _this.stompClient.subscribe("/sidebar/channels", function(frame) {_this.getChannels(frame);});
      },
      function(error) {}
    );
  }

  public getChannels(payload){
    console.log("getChannels has been called.")
    var channelArray = JSON.parse(payload.body);
    this.channels = channelArray;
    console.log(this.channels);
  }

  public goToChannel(channelName){
    //console.log("ChannelName: " + channelName);
    this.changeChannel.emit(channelName);
    //this.stompClient.send("/app/chat.getMessages", {}, JSON.stringify(channelName));
  }

  public disconnect() {
    this.stompClient.disconnect();
  }
}
