import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const BASE_URL = 'http://localhost:3000/projects/';
const HEADER = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

interface Project {
  id: string;
  title: string;
  details: string;
  percentComplete: number;
  approved: boolean;
  customerId: string;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteService {
  constructor(private http: HttpClient) {
  }

  all() {
    return this.http.get(BASE_URL);
  }

  create(project: Project) {
    return this.http.post(`${BASE_URL}`, JSON.stringify(project), HEADER);
  }

  update(project: Project) {
    return this.http.patch(`${BASE_URL}${project.id}`, JSON.stringify(project), HEADER);
  }

  delete(project: Project) {
    return this.http.delete(`${BASE_URL}${project.id}`);
  }
}
