'use client'

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { TaskType } from '../types/types';
import { LoadingOverlay } from './LoadingOverlay';

interface AddTaskProps {
  stageId: string;
  onAddTask: (task: Omit<TaskType, 'id'>) => Promise<void>;
}

export function AddTask({ stageId, onAddTask }: AddTaskProps) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddingNewTag, setIsAddingNewTag] = useState(false);
  const [availableTags, setAvailableTags] = useState(['Feature', 'Bug', 'Chore', 'Shopping']);
  const [formData, setFormData] = useState({ title: '', description: '', tag: '', assignee: '', priority: 'Low' as TaskType['priority'], dueDate: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAddTask({ ...formData, stageId });
    setLoading(false);
    setOpen(false);
    setFormData({ title: '', description: '', tag: '', assignee: '', priority: 'Low', dueDate: '' });
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      setAvailableTags(prev => [...prev, newTag.trim()]);
      setFormData(prev => ({ ...prev, tag: newTag.trim() }));
      setNewTag('');
      setIsAddingNewTag(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="w-full bg-gradient-to-r from-[#067473] via-green-500 to-[#067473] hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-2 px-4 rounded-md flex items-center justify-center" > <Plus className="w-4 h-4 mr-2" /> Add New Task </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingOverlay isLoading={loading} />
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="relative">
                        <button type="button" onClick={() => setIsAddingNewTag(false)} className="inline-flex text-sm text-gray-700 hover:text-gray-900" > Select List Tag </button> | <button type="button" onClick={() => setIsAddingNewTag(true)} className="inline-flex text-sm text-blue-500 hover:text-blue-600" > Create New Tag </button>
                        {   !isAddingNewTag && (
                                <select id="tag" value={formData.tag} onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))} required className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm" >
                                    <option value="">Select a tag</option> {availableTags.map(tag => ( <option key={tag} value={tag}>{tag}</option> ))}
                                </select>
                            )
                        }
                    </div>

                    {
                        isAddingNewTag && (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newTag}
                                placeholder="Enter new tag"
                                onChange={(e) => setNewTag(e.target.value)}
                                className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                              />
                              <button type="button" onClick={handleAddNewTag} className="mt-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" > Add </button>
                            </div>
                        )
                    }
                </div>

                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
                  <input
                    id="assignee"
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Enter assignee name"
                    required
                    className="mt-1block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                  <select 
                    id="priority" 
                    value={formData.priority} 
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskType['priority'] }))}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => { setOpen(false); setIsAddingNewTag(false); setNewTag(''); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" > Cancel </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" > Create Task </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
