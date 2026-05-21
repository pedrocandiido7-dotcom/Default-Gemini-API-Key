import React from 'react';
import { Car } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Car size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">
              DamageScan <span className="text-blue-600">Auto</span>
            </span>
          </div>
          
          <div className="text-sm text-gray-400 font-medium">
            © 2026 DamageScan Auto. Todos os direitos reservados.
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Termos</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Privacidade</a>
            <a href="#" className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors">Suporte</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
