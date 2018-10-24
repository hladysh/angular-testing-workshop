
import { Component, OnInit } from '@angular/core';
import { RemoteService } from './remote.service';

interface Project {
  id: string;
  title: string;
  details: string;
  percentComplete: number;
  approved: boolean;
  customerId: string;
}

@Component({
  selector: 'app-remote',
  templateUrl: './remote.component.html',
  styleUrls: ['./remote.component.css']
})
export class RemoteComponent implements OnInit {
  projects: Project[];

  constructor(private remoteService: RemoteService) {
  }

  ngOnInit() {
    this.getProjects();
  }

  getProjects() {
    this.remoteService.all()
      .subscribe((projects: Project[]) => this.projects = projects);
  }

  createProject(project) {
    this.remoteService.create(project)
      .subscribe(response => {
        this.getProjects();
      });
  }
}
