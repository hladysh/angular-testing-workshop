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

  reCalculateTotal(mode, projects, newProject) {
    this.projects = this.updateProjects(mode, projects, newProject);
    this.percentComplete = this.getTotalPercentComplete(this.projects);
  }

  updateProjects(mode, projects, newProject) {
    switch (mode) {
      case 'create':
        return this.addProject(projects, newProject);
      case 'update':
        return this.updateProject(projects, newProject);
      case 'delete':
        return this.deleteProject(projects, newProject);
      default:
        return projects;
    }
  }

  addProject(projects, project) {
    const newProject = Object.assign({}, project, {id: UUID.UUID()});
    return [...projects, newProject];
  }

  updateProject(projects, project) {
    return projects.map(proj => (project.id === proj.id) ? Object.assign({}, project) : proj);
  }

  deleteProject(projects, project) {
    return projects.filter(proj => project.id !== proj.id);
  }

  getTotalPercentComplete(projects) {
    return projects.reduce((acc, curr) => acc + curr.percentComplete, 0) / projects.length;
  }
}
