import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, mockProjects as initialProjects } from '@/data/mockData';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'status' | 'submittedAt'>, status?: 'pending' | 'approved') => void;
  approveProject: (projectId: string) => void;
  rejectProject: (projectId: string, comment: string) => void;
  getProjectsByUser: (userId: string) => Project[];
  getPendingProjects: () => Project[];
  getApprovedProjects: () => Project[];
  getRejectedProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (project: Omit<Project, 'id' | 'status' | 'submittedAt'>, status: 'pending' | 'approved' = 'pending') => {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      status,
      submittedAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const approveProject = (projectId: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, status: 'approved' as const, rejectionComment: undefined }
          : p
      )
    );
  };

  const rejectProject = (projectId: string, comment: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? { ...p, status: 'rejected' as const, rejectionComment: comment }
          : p
      )
    );
  };

  const getProjectsByUser = (userId: string) => {
    return projects.filter(p => p.submittedById === userId);
  };

  const getPendingProjects = () => projects.filter(p => p.status === 'pending');
  const getApprovedProjects = () => projects.filter(p => p.status === 'approved');
  const getRejectedProjects = () => projects.filter(p => p.status === 'rejected');

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        approveProject,
        rejectProject,
        getProjectsByUser,
        getPendingProjects,
        getApprovedProjects,
        getRejectedProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
