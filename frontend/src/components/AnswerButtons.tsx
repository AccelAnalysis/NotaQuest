import React from 'react';
import notesData from '../data/notation-basic.json';

interface AnswerButtonsProps {
  onAnswer: (noteId: string) => void;
  disabled?: boolean;
  className?: string;
}

const AnswerButtons: React.FC<AnswerButtonsProps> = ({ 
  onAnswer, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-4 gap-2 mt-8 ${className}`}>
      {notesData.notes.map((note) => (
        <button
          key={note.id}
          onClick={() => onAnswer(note.id)}
          disabled={disabled}
          className="
            p-4 text-xl font-bold rounded-lg 
            bg-blue-500 text-white 
            hover:bg-blue-600 
            active:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            touch-manipulation
          "
          style={{ minHeight: '60px' }}
        >
          {note.id}
        </button>
      ))}
    </div>
  );
};

export default AnswerButtons;
