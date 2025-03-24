import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Student {
  name: string;
  class_: string;
  marks: number;
}

@Component({
  selector: 'app-task3',
  standalone: false,
  templateUrl: './task3.component.html',
  styleUrl: './task3.component.css'
})
export class Task3Component {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  newStudent: Student = { name: '', class_: '', marks: 0 };
  filterValue: string = '';

  constructor(private http: HttpClient) {
    this.getStudents(); // Load students on component load
  }

  // ✅ Fetch all students
  getStudents() {
    this.http.get<Student[]>('http://localhost:8000/students').subscribe(
      data => {
        this.students = data;
        this.filteredStudents = data;
      },
      error => {
        console.error('Error fetching students:', error);
      }
    );
  }

  // ✅ Add new student
  addStudent() {
    if (this.newStudent.name && this.newStudent.class_ && this.newStudent.marks >= 0) {
      this.http.post('http://localhost:8000/add-student', this.newStudent).subscribe(
        () => {
          this.getStudents(); // Refresh list after adding
          this.newStudent = { name: '', class_: '', marks: 0 }; // Reset form
        },
        error => {
          console.error('Error adding student:', error);
        }
      );
    }
  }

  // ✅ Filter students by name or class
  filterData() {
    this.http.get<Student[]>(`http://localhost:8000/students/filter?query=${this.filterValue}`).subscribe(
      data => {
        this.filteredStudents = data;
      },
      error => {
        console.error('Error filtering students:', error);
      }
    );
  }
}
