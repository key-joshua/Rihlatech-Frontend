'use client'

import { DndProvider } from 'react-dnd';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { APIService } from '../services/apiService';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';

import { Logo } from './Logo';
import { Stage } from './Stage';
import { AddStage } from './AddStage';
import { Notification } from './Notification';
import { LoadingOverlay } from './LoadingOverlay';
import type { StageType, TaskType } from '../types/types';

export const Board = () => {
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [stages, setStages] = useState<StageType[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stagesResponse, tasksResponse] = await Promise.all([ APIService.getStages(), APIService.getTasks() ]);
        if (stagesResponse.ok && tasksResponse.ok) {
          const stagesData = await stagesResponse.json();
          const tasksData = await tasksResponse.json();
          setStages(stagesData?.data?.stages);
          setTasks(tasksData?.data?.tasks);
          setLoading(false);
          return;
        }
        
        setTasks([]);
        setStages([]);
        setLoading(false);
      } catch (error: any) {
        toast.warning('Error', error);
        console.error('Error fetching stages and tasks:', error);
      }
    };

    fetchData();
  }, []);

  const handleDrop = async (taskId: string, fromStage: string, toStage: string) => {
    console.log('Drop', taskId, fromStage, toStage);
    
    
    try {
      setLoading(true);
      if (fromStage === toStage) return setLoading(false);
      const response = await APIService.updateTask(taskId, { stageId: toStage });
      
      if (response.ok) {
        const taskData = tasks.find(t => t.id === taskId);
        const toStageTitle = stages.find(stage => stage.id === toStage)?.title;
        const fromStageTitle = stages.find(stage => stage.id === fromStage)?.title;
        
        if (taskData && fromStageTitle && toStageTitle) {
          setLoading(false);
          setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, stageId: toStage } : task) );
          addNotification({ taskTitle: taskData.title, isRead: false, toStage, fromStage, type: 'TASK_MOVED', message: `${taskData.title} was moved from ${fromStageTitle} to ${toStageTitle}` });
        };
      }
    } catch (error: any) {
      toast.warning('Error', error);
      console.error('Error creating stage:', error);
    }
  };

  const toggleStageCollapse = (stageId: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, isCollapsed: !stage.isCollapsed } : stage
    ));
  };

  const handleAddStage = async (title: string, description: string) => {
    try {
      setLoading(true);
      const response = await APIService.createStage({ title, description });

      if (response.ok) {
        const stageData = await response.json();
        setStages(prev => [...prev, stageData?.data?.stage]);
        setLoading(false);
        return;
      }
    } catch (error: any) {
      toast.warning('Error', error);
      console.error('Error creating stage:', error);
    }
  };

  const handleAddTask = async (newTask: Omit<TaskType, 'id'>) => {
    setLoading(true);
    try {
      const response = await APIService.createTask(newTask);
      
      if (response.ok) {
        const taskData = await response.json();
        setTasks(prev => [...prev, taskData?.data?.task]);
        const stageName = stages.find(stage => stage.id === newTask.stageId)?.title;
        addNotification({ taskTitle: taskData.title, isRead: false, toStage: taskData?.stageId, fromStage: taskData?.stageId, type: 'TASK_ASSIGNED', message: `New task ${taskData.title} created in ${stageName} Stage`, });
        setLoading(false);
      };
    } catch (error: any) {
      toast.warning('Error', error);
      console.error('Error creating stage:', error);
    }
  };

  const handleEditTask = async (updatedTask: TaskType) => {
    console.log('Update Task', updatedTask);
    toast.warning('Update Task Not Implemented Yet.', { autoClose: false });
  };

  const handleDeleteStage = async (stageId: string) => {
    try {
      setLoading(true);
      const stageResponse = await APIService.deleteStage(stageId);

      if (stageResponse.ok) {
        setStages(prevStages => prevStages.filter(stage => stage.id !== stageId));
        toast.success('Stage deleted successfully');
        setLoading(false);
        return;
      }
    } catch (error: any) {
      toast.warning('Error', error);
      console.error('Error creating stage:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await APIService.deleteTask(taskId);

      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ToastContainer />
      <AnimatePresence>
        <LoadingOverlay isLoading={loading} />
      </AnimatePresence>
      <div className="py-[2%] px-[5%] min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <Notification stages={stages} />
        </div>
        <motion.div className="flex gap-6 items-start overflow-x-auto pb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} >
          {stages.map((stage, index) => (
            <motion.div key={stage.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} >
              <Stage stage={stage} tasks={tasks} onDrop={handleDrop} onDelete={() => handleDeleteStage(stage.id)} onToggleCollapse={() => toggleStageCollapse(stage.id)} onAddTask={handleAddTask} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
            </motion.div>
          ))}

          <motion.div className="w-80 flex items-center justify-center min-h-[420px] bg-gray-50 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stages.length * 0.1 }} >
            <AddStage onAdd={handleAddStage} />
          </motion.div>
        </motion.div>
      </div>
    </DndProvider>
  );
}
