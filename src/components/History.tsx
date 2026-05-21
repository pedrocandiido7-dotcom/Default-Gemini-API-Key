import React from 'react';
import { Inspection } from '../types';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryProps {
  inspections: Inspection[];
  onSelect: (inspection: Inspection) => void;
  onNew: () => void;
}

export const History: React.FC<HistoryProps> = ({ inspections, onSelect, onNew }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-gray-900">Histórico de Vistorias</h2>
        <button 
          onClick={onNew}
          className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all border border-blue-100"
        >
          <Plus size={20} />
          Nova
        </button>
      </div>

      {inspections.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Nenhuma vistoria encontrada.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {inspections.map((inspection, idx) => {
            const total = inspection.damages.reduce((sum, d) => sum + d.estimatedCost, 0);
            return (
              <motion.div
                key={inspection.id}
                whileHover={{ y: -5 }}
                onClick={() => onSelect(inspection)}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative aspect-video rounded-t-3xl overflow-hidden p-3 bg-gray-50">
                  <img 
                    src={inspection.imageUrl} 
                    alt="Vistoria" 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <span className="text-blue-600">6.2%</span>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{inspection.date}</span>
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-blue-400 uppercase tracking-widest">REPARO</span>
                      <span className="text-lg font-black text-blue-600">R$ {total.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                    {inspection.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {Array.from(new Set(inspection.damages.map(d => d.type.split(' ')[0]))).slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] uppercase font-black bg-gray-100 border border-transparent px-3 py-1 rounded-md text-gray-400 tracking-widest">
                        {tag}
                      </span>
                    ))}
                    {inspection.damages.length > 3 && (
                      <span className="text-[9px] uppercase font-black bg-gray-100 border border-transparent px-3 py-1 rounded-md text-gray-400 tracking-widest">
                        +{inspection.damages.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
