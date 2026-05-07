import React from 'react';
import { Car } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'history') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Car size={24} />
        </div>
        <span className="text-xl font-bold text-gray-900">
          DamageScan <span className="text-blue-600">Auto</span>
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate('home')}
          className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-blue-600 underline underline-offset-8' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Nova Vistoria
        </button>
        <button 
          onClick={() => onNavigate('history')}
          className={`text-sm font-medium transition-colors ${currentView === 'history' ? 'text-blue-600 underline underline-offset-8' : 'text-gray-600 hover:text-blue-600'}`}
        >
          Histórico
        </button>
      </div>

      <div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
          Entrar
        </button>
      </div>
    </nav>
  );
};
