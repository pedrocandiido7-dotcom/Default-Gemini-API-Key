import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InspectionResult } from './components/InspectionResult';
import { History } from './components/History';
import { Footer } from './components/Footer';
import { Inspection } from './types';
import { analyzeVehicleImage } from './services/geminiService';

export default function App() {
  const [view, setView] = useState<'home' | 'history' | 'result'>('home');
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(null);
  const [history, setHistory] = useState<Inspection[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Persistence placeholder - will connect to Firebase once setup is complete
  useEffect(() => {
    const savedHistory = localStorage.getItem('inspectionHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (inspection: Inspection) => {
    const newHistory = [inspection, ...history];
    setHistory(newHistory);
    localStorage.setItem('inspectionHistory', JSON.stringify(newHistory));
  };

  const handleImageSelect = async (base64: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVehicleImage(base64.split(',')[1]);
      const newInspection: Inspection = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        imageUrl: base64,
        summary: result.summary || 'Vistoria técnica concluída.',
        damages: result.damages || [],
        overallState: result.overallState || 'Fair',
        originalityStatus: (result.originalityStatus as 'Original' | 'Altered' | 'Unknown') || 'Unknown',
      };
      
      setCurrentInspection(newInspection);
      saveToHistory(newInspection);
      setView('result');
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Falha na análise técnica. Por favor, tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      <Navbar 
        onNavigate={(v) => setView(v)} 
        currentView={view === 'result' ? 'home' : view} 
      />

      <main className="flex-1">
        {view === 'home' && (
          <Hero onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
        )}
        
        {view === 'result' && currentInspection && (
          <InspectionResult 
            inspection={currentInspection} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'history' && (
          <History 
            inspections={history} 
            onSelect={(insp) => {
              setCurrentInspection(insp);
              setView('result');
            }}
            onNew={() => setView('home')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

