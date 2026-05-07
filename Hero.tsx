import React, { useRef } from 'react';
import { Camera, Upload, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onImageSelect: (base64: string) => void;
  isAnalyzing: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onImageSelect, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 items-center gap-16">
      <div className="space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.95]">
            Inteligentes com <br />
            <span className="text-blue-600">Estimativa de Custo.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-lg font-medium leading-relaxed">
            Identifique danos automaticamente e receba uma estimativa instantânea de reparo baseada no mercado brasileiro.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4"
        >
          <button 
            disabled={isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Camera size={20} />
            Tirar Foto
          </button>
          
          <button 
            disabled={isAnalyzing}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold hover:border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <Upload size={20} />
            Upload Imagem
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100"
        >
          <div>
            <span className="block text-3xl font-bold text-blue-600">2</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vistorias</span>
          </div>
          <div>
            <span className="block text-3xl font-bold text-blue-600">98%</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Precisão</span>
          </div>
          <div>
            <span className="block text-3xl font-bold text-blue-600 uppercase">IA</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gemini 1.5 PRO</span>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div 
          className="w-full aspect-square md:aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-200 bg-blue-50/30 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-600 font-bold animate-pulse">Analisando Veículo...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-full shadow-lg text-blue-600">
                <Upload size={40} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">Arraste ou clique para upload</p>
                <p className="text-sm text-gray-400">PNG, JPG até 10MB</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
