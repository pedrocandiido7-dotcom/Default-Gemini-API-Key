import React from 'react';
import { ChevronLeft, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Inspection, Damage } from '../types';
import { motion } from 'motion/react';

interface InspectionResultProps {
  inspection: Inspection;
  onBack: () => void;
}

const DamageCard: React.FC<{ damage: Damage }> = ({ damage }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-50 text-red-500 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-500 border-orange-100';
      default: return 'bg-blue-50 text-blue-500 border-blue-100';
    }
  };

  const getBadgeStyles = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500 text-white border-red-600';
      case 'medium': return 'bg-orange-400 text-white border-orange-500';
      default: return 'bg-blue-500 text-white border-blue-600';
    }
  };

  const Icon = damage.type.toLowerCase().includes('peça') ? AlertCircle : (damage.severity === 'High' ? AlertTriangle : AlertCircle);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 flex gap-8 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-2xl h-fit border shrink-0 ${getSeverityStyles(damage.severity)}`}>
        <Icon size={28} />
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {damage.type} — <span className="font-medium text-gray-500 tracking-normal">{damage.part}</span>
          </h4>
          <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-md tracking-widest ${getBadgeStyles(damage.severity)}`}>
            SEVERIDADE {damage.severity}
          </span>
        </div>
        <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
          {damage.description}
        </p>
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reparo estimado:</span>
          <span className="text-lg font-black text-gray-900">R$ {damage.estimatedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
};

export const InspectionResult: React.FC<InspectionResultProps> = ({ inspection, onBack }) => {
  const totalRepair = inspection.damages.reduce((sum, d) => sum + d.estimatedCost, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Detalhamento Técnico</h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-black hover:gap-3 transition-all text-sm uppercase tracking-widest"
        >
          <ChevronLeft size={18} />
          Nova Vistoria
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 space-y-8">
          <div className="rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl">
            <img src={inspection.imageUrl} alt="Vehicle Uploaded" className="w-full object-cover aspect-[4/5]" />
          </div>
          
          <div className="space-y-6 px-2">
            <div>
              <span className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em]">ESTADO GERAL</span>
              <p className="text-xl font-extrabold text-gray-900 leading-tight mt-2">{inspection.summary}</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">ORIGINALIDADE</span>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                <AlertCircle size={16} />
                <span className="text-xs font-black uppercase tracking-widest">Alterado</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-200">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">ESTIMATIVA DE REPARO</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-lg font-bold">R$</span>
              <span className="text-5xl font-black tracking-tight">{totalRepair.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-6">
          {inspection.damages.map((damage, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <DamageCard damage={damage} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
