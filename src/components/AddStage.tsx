'use client'

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddStageProps {
  onAdd: (title: string, description: string) => void
}

export const AddStage = ({ onAdd }: AddStageProps) => {
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setTitle('');
      setDescription('');
      setIsOpen(false);
      onAdd(title.trim(), description.trim());
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(true)} className="group relative flex flex-col items-center" >
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:border-solid group-hover:border-gray-400 group-hover:scale-110"> <Plus className="w-5 h-5 text-gray-400 transition-all duration-300 ease-in-out group-hover:text-gray-600 group-hover:rotate-90" /> </div>
        <span className="mt-2 text-sm text-gray-500 transition-opacity duration-300 opacity-0 group-hover:opacity-100"> Add Stage </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Add New Stage</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600" > <X className="w-5 h-5" /> </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                autoFocus
                type="text"
                value={title}
                placeholder="Enter stage title"
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4"
              />
              <textarea
                rows={3}
                value={description}
                placeholder="Enter stage description"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-4 resize-none"
              />
              <button type="submit" className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800" > Create Stage </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
