import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task2',
  standalone: false,
  templateUrl: './task2.component.html',
  styleUrl: './task2.component.css'
})
export class Task2Component implements OnInit {
  socket!: WebSocket;
  userId: string = '';
  targetUserId: string = '';
  messages: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(): void {
    fetch('http://127.0.0.1:8000/generate-id')
      .then(response => response.json())
      .then(data => {
        this.userId = data.userId;
        this.connectWebSocket();
      });
  }

  connectWebSocket(): void {
    this.socket = new WebSocket(`ws://127.0.0.1:8000/ws/${this.userId}`);

    this.socket.onopen = () => {
      console.log(`WebSocket connected as ${this.userId}`);
    };

    this.socket.onmessage = (event) => {
      this.messages.push(event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
    };
  }

  connectToUser(): void {
    if (this.targetUserId) {
      this.socket.send(JSON.stringify({
        targetUserId: this.targetUserId,
        connect_request: true
      }));
    }
  }

  sendMessage(messageInput: HTMLInputElement): void {
    const message = messageInput.value.trim();

    if (message && this.targetUserId) {
      this.socket.send(JSON.stringify({
        targetUserId: this.targetUserId,
        message: message
      }));
      messageInput.value = '';
    } else {
      alert('You are not connected to any user.');
    }
  }
}
