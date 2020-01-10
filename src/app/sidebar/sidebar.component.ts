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
      function(error) {
        alert( error );
      }
    );
  }

  public getChannels(payload){
    console.log("getChannels has been called.")
    var channelArray = JSON.parse(payload.body);
    var _this = this;

    for(var i = 0; i < channelArray.length; i++) {
        var channel = channelArray[i];
        var channelElement = document.createElement('li');
        var linkElement = document.createElement('button');
        linkElement.innerHTML = channel.channel_name;
        linkElement.id = channel.channel_name;
        linkElement.onclick = function(){_this.goToChannel(linkElement.id)};
        channelElement.appendChild(linkElement);
        this.channelArea.nativeElement.appendChild(channelElement);
        this.channelArea.nativeElement.scrollTop = this.channelArea.nativeElement.scrollHeight;
    }
  }

  public goToChannel(channelName){
    this.changeChannel.emit(channelName);
    //this.stompClient.send("/app/chat.getMessages", {}, JSON.stringify(channelName));
  }

  public disconnect() {
    this.stompClient.disconnect();
  }
}
