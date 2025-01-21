import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventGroupsService {
  private apiUrl = '/api/event-groups';

  constructor(private http: HttpClient) {}

  getEventGroups(): Observable<any> {
    return this.http.get(this.apiUrl); // Face GET la /api/event-groups
  }
  addEventToGroup(
    groupId: string,
    event: { name: string; startTime: string; endTime: string }
  ): Observable<any> {
    return this.http.post(`/api/event-groups/${groupId}/events`, event);
  }
  createEventGroup(data: {
    name: string;
    repeatInterval: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data); // Face POST la /api/event-groups
  }
}
