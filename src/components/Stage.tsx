'use client'

import { Task } from './Task';
import { AddTask } from './AddTask';
import { useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import type { StageType, TaskType } from '../types/types';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface StageProps {
  stage: StageType;
  tasks: TaskType[];
  onDelete: () => void;
  onToggleCollapse: () => void;
  onAddTask: (task: Omit<TaskType, 'id'>) => Promise<void>;
  onDrop: (taskId: string, fromStage: string, toStage: string) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (taskId: string) => void;
}

export const Stage = ({ stage, tasks, onDrop, onDelete, onToggleCollapse, onAddTask, onEditTask, onDeleteTask }: StageProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    drop: (item: { id: string; fromStage: string }) => { onDrop(item.id, item.fromStage, stage.id); },
  }));

  const stageTasks = tasks.filter(task => task.stageId === stage.id);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1, height: stage.isCollapsed ? '110px' : 'auto', minHeight: stage.isCollapsed ? '110px' : '420px', }} transition={{ duration: 0.2 }} ref={drop as unknown as React.Ref<HTMLDivElement>} className={`w-80 bg-gray-50 rounded-lg p-4 overflow-hidden ${ isOver ? 'bg-gray-100' : '' }`} >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">{stage.title}</h2>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.1 }} onClick={onToggleCollapse} className="text-gray-400 hover:text-gray-600" >
              {stage.isCollapsed ? ( <ChevronDown className="w-5 h-5" /> ) : ( <ChevronUp className="w-5 h-5" /> )}
            </motion.button>
            
            <motion.button whileHover={{ scale: 1.1, color: '#ef4444' }} onClick={onDelete} className="text-gray-400 hover:text-red-600 transition-colors duration-200" >
              <Trash2 className="w-5 h-5" />
            </motion.button>
        </div>
      </div>

      <div className="mb-4 h-[50px]">
        <p className="text-sm text-gray-500">{stage.description}</p>
      </div>

      <AnimatePresence>
        {!stage.isCollapsed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="space-y-10" >
            {stageTasks.map((task) => ( <Task key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} /> ))}
            <AddTask stageId={stage.id} onAddTask={onAddTask} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
