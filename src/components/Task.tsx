'use client'

import { format } from 'date-fns';
import { useDrag } from 'react-dnd';
import type { TaskType } from '../types/types';

interface TaskProps {
  task: TaskType;
  onEdit: (task: TaskType) => void;
  onDelete: (taskId: string) => void;
};

export const Task = ({ task, onEdit, onDelete }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id, fromStage: task.stageId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className={`cursor-move rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white border border-gray-300 ${ isDragging ? 'opacity-50' : '' }`} >
      <div className="flex justify-end">
        <div className="px-3 py-1 text-xs rounded-tr-lg font-medium text-white" style={{ background: 'linear-gradient(135deg, #067473 0%, #24c45d 100%)', maxWidth: 'calc(100% - 1rem)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', }} > {task.tag} </div>
      </div>

      <div className="grid gap-2 p-4">
        <div className="flex flex-col mb-2">
          <span className="text-lg font-semibold text-gray-800">{task.title}</span>
        </div>

        <div className="flex flex-col text-sm">
          <span className="text-gray-500 mb-1">Description</span>
          <div className="bg-gray-100 p-3 rounded-md w-full min-h-[100px] text-sm text-gray-700 focus:outline-none focus:ring-2 transition-all"> {task.description} </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Assignee</span>
          <span>{task.assignee}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Priority</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${ task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600' }`} > {task.priority} </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Due Date</span>
          <span>{format(task.dueDate, 'dd MMM yyyy')}</span>
        </div>
      </div>

      <div className="my-2 mx-2 flex justify-end space-x-2">
        <div onClick={() => onEdit(task)} className="w-20 h-7 flex items-center justify-center p-1 text-[#067473] border border-[#067473] rounded-md transition-all duration-200 cursor-pointer hover:bg-[#067473] hover:text-white" > Edit </div>
        <div onClick={() => onDelete(task.id)} className="w-20 h-7 flex items-center justify-center p-1 text-red-600 border border-red-600 rounded-md transition-all duration-200 cursor-pointer hover:bg-red-600 hover:text-white" > Delete </div>
      </div>
    </div>
  );
};
