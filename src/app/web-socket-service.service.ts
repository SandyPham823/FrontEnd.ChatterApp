import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  private serverUrl = 'https://5primechatter.cfapps.io/prime5chatter';
  stompClient: SockJS;

  constructor() {}

  public getClient() { 
    let socket = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(socket);
    return this.stompClient;
  }

  public subscribe() {

  }

  public disconnect(stompClient: SockJS) {
    stompClient.disconnect();
  }
}
