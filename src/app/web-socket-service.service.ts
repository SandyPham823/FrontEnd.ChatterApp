import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {

  private serverUrl = 'http://localhost:8080/prime5chatter';
  private stompClient;

  constructor() { }

  public connect() { 
    let socket = new SockJS(this.serverUrl);
    let stompClient = Stomp.over(socket);
    return stompClient; 
} 
}
