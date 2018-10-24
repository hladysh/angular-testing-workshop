import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Project } from '@workshop/core-data';

@Injectable({
  providedIn: 'root'
})
export class RefactorService {
  percentComplete;
  mode;
  projects: Project[];

  constructor() {
  }

  reCalculateTotal(project: Project) {
    switch (this.mode) {
      case 'create':
        const newProject = Object.assign({}, project, {id: UUID.UUID()});
        this.projects = [...this.projects, newProject];
        break;
      case 'update':
        this.projects = this.projects.map(proj => (project.id === proj.id) ? Object.assign({}, project) : proj);
        break;
      case 'delete':
        this.projects = this.projects.filter(proj => project.id !== proj.id);
        break;
      default:
        break;
    }

    this.percentComplete = this.projects.reduce((acc, curr) => acc + curr.percentComplete, 0) / this.projects.length;
  }
}
