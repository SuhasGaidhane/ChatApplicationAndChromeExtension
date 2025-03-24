import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface TimeEntry {
  domain: string;
  timeSpent: number;
  timestamp: string;
}

@Component({
  selector: 'app-task4',
  standalone: false,
  templateUrl: './task4.component.html',
  styleUrl: './task4.component.css'
})
export class Task4Component implements OnInit {
  timeEntries: TimeEntry[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<any[]>('http://localhost:8000/get-tracking-data')
      .subscribe(data => {
        this.timeEntries = data.map(entry => ({
          domain: new URL(entry.url).hostname, // Extract domain correctly
          timeSpent: entry.time_spent / 60, // Convert to minutes
          timestamp: new Date().toISOString() // Generate timestamp
        }));
      });
  }
}
