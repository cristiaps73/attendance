import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-group',
  templateUrl: './event-group.component.html',
  styleUrls: ['./event-group.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EventGroupComponent implements OnInit {
  group: any = null; // Grupul curent
  events: any[] = []; // Evenimentele din grupul curent
  errorMessage: string = '';
  newEvent = { name: '', startTime: '', endTime: '' };

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEventGroup();
  }

  loadEventGroup(): void {
    const groupId = this.route.snapshot.paramMap.get('id'); // Preia ID-ul din URL
    if (groupId) {
      this.http.get<any>(`/api/event-groups/${groupId}`).subscribe({
        next: (data) => {
          this.group = data;
          this.events = data.Events || [];
        },
        error: (err) => {
          console.error('Error loading group:', err);
          this.errorMessage = 'Failed to load group details';
        },
      });
    }
  }

  saveGroup(): void {
    if (this.group) {
      this.http.put(`/api/event-groups/${this.group.id}`, this.group).subscribe({
        next: () => {
          alert('Group updated successfully');
        },
        error: (err) => {
          console.error('Error updating group:', err);
          this.errorMessage = 'Failed to update group';
        },
      });
    }
  }

  addEvent(): void {
    if (this.group) {
      const { name, startTime, endTime } = this.newEvent;
  
      // Construirea obiectului evenimentului
      const event = {
        name,
        startTime: new Date(startTime).toISOString(), // Formatare corectă
        endTime: new Date(endTime).toISOString(),     // Formatare corectă
        groupId: this.group.id,
      };
  
      // Trimiterea cererii POST către backend
      this.http.post<any>('/api/events', event).subscribe({
        next: (data) => {
          this.events.push(data); // Actualizare listă locală cu noul eveniment
          this.newEvent = { name: '', startTime: '', endTime: '' }; // Resetare formular
          alert(`Event added successfully! Access Code: ${data.accessCode}`); // Afișare cod acces
        },
        error: (err) => {
          console.error('Error adding event:', err);
          this.errorMessage = 'Failed to add event'; // Mesaj de eroare
        },
      });
    }
  }
  
}
