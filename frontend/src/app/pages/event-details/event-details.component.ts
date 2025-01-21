import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
  standalone: true,
    imports: [CommonModule, FormsModule],
})
export class EventDetailsComponent implements OnInit {
  eventId: string = '';
  event: any = { name: '', startTime: '', endTime: '' };
  attendees: any[] = [];
  newAttendee = { name: '', email: '' };
  errorMessage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEventDetails();
    this.loadAttendees();
  }

  loadEventDetails(): void {
    this.http.get(`/api/events/${this.eventId}`).subscribe({
      next: (data: any) => {
        this.event = data;
      },
      error: (err) => {
        console.error('Error loading event details:', err);
        this.errorMessage = 'Failed to load event details';
      },
    });
  }

  loadAttendees(): void {
    this.http.get(`/api/events/${this.eventId}/attendees`).subscribe({
      next: (data: any) => {
        this.attendees = data;
      },
      error: (err) => {
        console.error('Error loading attendees:', err);
        this.errorMessage = 'Failed to load attendees';
      },
    });
  }

  addAttendee(): void {
    this.http
      .post(`/api/events/${this.eventId}/attendees`, this.newAttendee)
      .subscribe({
        next: (data: any) => {
          this.attendees.push(data);
          this.newAttendee = { name: '', email: '' }; // Resetează formularul
        },
        error: (err) => {
          console.error('Error adding attendee:', err);
          this.errorMessage = 'Failed to add attendee';
        },
      });
  }
}
