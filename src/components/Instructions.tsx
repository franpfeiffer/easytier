import React from 'react';
import { X } from 'lucide-react';
import { InstructionsProps } from '../interfaces/InstructionsProps';
import { instructions } from '../utils/Instructions';
import { LanguageChange } from '../interfaces/LanguageChange';
import { languages } from '../languages/languages';

const Instructions: React.FC<InstructionsProps> = ({ language, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {language === 'en' ? 'Instructions' : 'Instrucciones'}
        </h2>
        <ol className="space-y-3">
          {instructions[language].map((instruction, index) => (
            <li key={index} className="flex gap-3 text-gray-700">
              <span className="font-bold">{index + 1}.</span>
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Instructions;
