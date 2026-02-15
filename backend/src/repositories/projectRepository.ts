import { randomUUID } from 'crypto';
import { Project } from '../types/domain';

interface ProjectRecord extends Project {
  memberIds: string[];
}

const projects: ProjectRecord[] = [];

export const projectRepository = {
  create(input: Omit<ProjectRecord, 'id' | 'memberIds'>) {
    const project: ProjectRecord = { ...input, id: randomUUID(), memberIds: [input.ownerId] };
    projects.push(project);
    return project;
  },
  list() {
    return projects;
  },
  addMember(projectId: string, userId: string) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.memberIds.length >= project.maxMembers) {
      throw new Error('Project is full');
    }
    if (!project.memberIds.includes(userId)) {
      project.memberIds.push(userId);
    }
    return project;
  }
};
