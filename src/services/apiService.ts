import type { StageType, TaskType, NotificationType } from '../types/types';

export const APIService = {
  createStage: async (data: Partial<StageType>): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/stages`, { method: 'POST', headers, body: JSON.stringify(data) });
  },

  createTask: async (data: Partial<TaskType>): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/tasks`, { method: 'POST', headers, body: JSON.stringify(data) });
  },

  createNotification: async (data: Partial<NotificationType>): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/notifications`, { method: 'POST', headers, body: JSON.stringify(data) });
  },

  getStages: async (): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/stages`, { method: 'GET', headers });
  },
  
  getTasks: async (): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/tasks`, { method: 'GET', headers });
  },

  getNotifications: async (): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/notifications`, { method: 'GET', headers });
  },

  updateTask: async (taskId: string, data: Partial<TaskType>): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/tasks/${taskId}`, { method: 'PATCH', headers, body: JSON.stringify(data) });
  },

  updateNotification: async (): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/notifications`, { method: 'PATCH', headers });
  },

  deleteTask: async (taskId: string): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/tasks/${taskId}`, { method: 'DELETE', headers });
  },

  deleteStage: async (stageId: string): Promise<Response> => {
    const headers = { 'Content-Type': 'application/json' };
    return await fetch(`${process.env.REACT_APP_RIHLATECH_BACKEND}/api/stages/${stageId}`, { method: 'DELETE', headers });
  },
};
