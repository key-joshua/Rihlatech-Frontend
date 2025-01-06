'use client'

import { Board } from './Board';
import { NotificationProvider } from '../contexts/NotificationContext';

export function BoardWrapper() {
  return (
    <NotificationProvider>
      <Board />
    </NotificationProvider>
  )
}

