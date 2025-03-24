import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task1',
  standalone: false,
  templateUrl: './task1.component.html',
  styleUrl: './task1.component.css'
})
export class Task1Component implements OnInit {
  weatherData: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchWeatherData();
  }

  fetchWeatherData() {
    const apiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true';

    this.http.get(apiUrl).subscribe({
      next: (data) => {
        console.log('Weather Data:', data);
        this.weatherData = data;
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
      }
    });
  }
}
