import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HomeComponent implements OnInit {
  myEvents: any[] = [];
  myEventGroups: any[] = [];
  newGroup = { name: '', repeatInterval: '' }; // Grup nou de evenimente
  errorMessage: string = '';
  eventCode: string = '';
  successMessage: string = '';
  username: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadMyEvents();
    this.loadMyEventGroups();
  }

  loadMyEvents(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });

    this.http.get<any[]>('http://localhost:5000/api/attendees/my-events', { headers }).subscribe({
      next: (data) => {
        console.log('My Events:', data);
        this.myEvents = data; // Atribuie lista de evenimente
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.errorMessage = 'Failed to load your events';
      },
    });
  }
  
  
  
  
  loadMyEventGroups(): void {
    this.http.get<any[]>('/api/event-groups/my-groups').subscribe({
      next: (data) => {
        console.log('My Event Groups:', data);
        this.myEventGroups = data;
      },
      error: (err) => {
        console.error('Error loading event groups:', err);
        this.errorMessage = 'Failed to load event groups';
      },
    });
  }
  
  
  createEventGroup(): void {
    this.http.post('/api/event-groups', this.newGroup).subscribe({
      next: (data: any) => {
        this.myEventGroups.push(data);
        this.newGroup = { name: '', repeatInterval: '' };
      },
      error: (err) => {
        console.error('Error creating event group:', err);
        this.errorMessage = 'Failed to create event group';
      },
    });
  }
  
  

  editEventGroup(groupId: string): void {
    this.router.navigate([`/event-groups/${groupId}/edit`]); // Navighează către pagina de editare
  }

  registerForEvent(): void {
    if (this.username.trim() && this.eventCode.trim()) {
      // Construiește email-ul din username
      const attendeeEmail = `${this.username}@email.com`;

      // Trimite cererea de înscriere
      this.http.post<any>(`http://localhost:5000/api/events/register/${this.eventCode}`, {
        name: this.username,
        email: attendeeEmail,
        username: this.username
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Trimite token-ul în header
        }
      }).subscribe({
        next: (data) => {
          this.successMessage = `Successfully registered for event: ${data.name}`;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Failed to register for the event. Please check the event code.';
          this.successMessage = '';
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid username and event code.';
      this.successMessage = '';
    }
  }

  exportToCSV(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
  
    // Apelăm backend-ul pentru a exporta datele într-un fișier CSV
    this.http.get('http://localhost:5000/api/attendees/my-events/export-csv', { headers, responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        // Creăm un URL pentru fișierul CSV și îl descărcăm
        const blob = new Blob([data], { type: 'text/csv' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'my-events.csv');
        link.click();
      },
      error: (err) => {
        console.error('Error exporting CSV:', err);
        this.errorMessage = 'Failed to export events';
      }
    });
  }
  
  exportCreatedEvents(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.http.get('http://localhost:5000/api/events/export-created-events', { headers, responseType: 'text' }).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'events.csv';
        link.click();
      },
      error: (err) => {
        console.error('Error exporting events:', err);
      }
    });
  }
  
  downloadCSV(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.http.get('http://localhost:5000/api/events/export-all-with-attendees', { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        // Creăm un link pentru descărcarea fișierului CSV
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'events_with_attendees.csv';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading CSV:', err);
      },
    });
  }
  

}
