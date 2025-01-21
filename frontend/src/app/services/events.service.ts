import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = '/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl); // Face GET la /api/events
  }

  createEvent(data: { name: string; startTime: string; endTime: string; groupId: string }): Observable<any> {
    return this.http.post(this.apiUrl, data); // Face POST la /api/events
  }
}
