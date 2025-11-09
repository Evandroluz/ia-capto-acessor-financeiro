import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { AnalysisResult, EntryTime } from '../types';
import { TTSPlaybackState } from '../types';
// Fix: Import generateSpeech from apiService as geminiService is deprecated.
import { generateSpeech } from '../services/apiService';
import { decode, decodeAudioData } from '../utils/audioUtils';
import { Loader } from './Loader';
import { IconSpeaker, IconPlaying, IconArrowUp, IconArrowDown, IconClock } from './Icons';

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
}

const AnalysisSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-800/60 p-4 rounded-lg h-full">
    <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">{title}</h3>
    {children}
  </div>
);

const RecommendationPill: React.FC<{ recommendation: string }> = ({ recommendation }) => {
  const baseClasses = "px-4 py-2 text-lg md:text-xl font-bold rounded-lg inline-flex items-center gap-2";
  let colorClasses = "bg-gray-500/20 text-gray-300";
  let Icon = IconClock;

  const recommendationLower = recommendation.toLowerCase();

  if (recommendationLower.includes('compra')) {
    colorClasses = "bg-green-500/20 text-green-300";
    Icon = IconArrowUp;
  } else if (recommendationLower.includes('venda')) {
    colorClasses = "bg-red-500/20 text-red-300";
    Icon = IconArrowDown;
  } else if (recommendationLower.includes('aguardar')) {
    colorClasses = "bg-yellow-500/20 text-yellow-300";
    Icon = IconClock;
  }
  
  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <Icon className="w-5 h-5" />
      <span>{recommendation}</span>
    </div>
  );
};

const PatternsDisplay: React.FC<{ patterns: string[] }> = ({ patterns }) => {
    const groupedPatterns = patterns.reduce((acc, pattern) => {
        const parts = pattern.split(':');
        const category = parts.length > 1 ? parts[0].trim() : 'Geral';
        const description = parts.length > 1 ? parts.slice(1).join(':').trim() : pattern;
        
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(description);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="space-y-4">
            {Object.entries(groupedPatterns).map(([category, patternList]) => (
                <div key={category}>
                    <h4 className="text-md font-bold text-gray-300 mb-2">{category}</h4>
                    <ul className="flex flex-wrap gap-2">
                        {patternList.map((pattern, index) => (
                            <li key={index} className="bg-indigo-900/50 text-indigo-200 text-sm font-medium px-3 py-1 rounded-full">
                                {pattern}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

const EntryTimeDisplay: React.FC<{ entryTime: EntryTime; recommendation: string }> = ({ entryTime, recommendation }) => {
  const recommendationLower = recommendation.toLowerCase();
  let colorClasses = 'text-gray-300';
  let animationClass = '';

  if (recommendationLower.includes('compra')) {
    colorClasses = 'text-green-400';
    animationClass = 'animate-pulse-green';
  } else if (recommendationLower.includes('venda')) {
    colorClasses = 'text-red-400';
    animationClass = 'animate-pulse-red';
  }

  const formatEntryTimes = () => {
    if (!entryTime || !entryTime.main) return "Aguardando...";
    let parts = [`Entrada: ${entryTime.main}`];
    if (entryTime.reentries && entryTime.reentries.length > 0) {
      parts.push(`Reentrada 1: ${entryTime.reentries[0]}`);
    }
    if (entryTime.reentries && entryTime.reentries.length > 1) {
      parts.push(`Reentrada 2: ${entryTime.reentries[1]}`);
    }
    return parts.join(' | ');
  };

  return (
    <p className={`text-xl font-bold ${colorClasses} ${animationClass} transition-colors duration-300`}>
      {formatEntryTimes()}
    </p>
  );
};


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const [playbackState, setPlaybackState] = useState<TTSPlaybackState>(TTSPlaybackState.IDLE);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } catch (e) {
            console.error("AudioContext is not supported by this browser.", e);
            setPlaybackState(TTSPlaybackState.ERROR);
        }
    }
    
    return () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }
    };
  }, []);

  const handleReadAloud = useCallback(async () => {
    if (playbackState === TTSPlaybackState.PLAYING) {
      if(audioSourceRef.current) {
        audioSourceRef.current.stop();
      }
      setPlaybackState(TTSPlaybackState.IDLE);
      return;
    }
    
    if (!analysis.summary || !audioContextRef.current) return;
    
    setPlaybackState(TTSPlaybackState.LOADING);
    
    try {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      // Fix: Call the new apiService function and handle the response object.
      const response = await generateSpeech(analysis.summary);
      if (response.error || !response.audioContent) {
        throw new Error(response.error || 'No audio content received.');
      }
      const base64Audio = response.audioContent;
      const audioData = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => {
        setPlaybackState(TTSPlaybackState.IDLE);
        audioSourceRef.current = null;
      };
      
      source.start();
      audioSourceRef.current = source;
      setPlaybackState(TTSPlaybackState.PLAYING);

    } catch (err) {
      console.error('Failed to play audio:', err);
      setPlaybackState(TTSPlaybackState.ERROR);
    }
  }, [analysis.summary, playbackState]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisSection title="Ativo">
          <p className="text-2xl font-bold text-white">{analysis.asset}</p>
        </AnalysisSection>
        <AnalysisSection title="Período">
          <p className="text-2xl font-bold text-white">{analysis.timeframe}</p>
        </AnalysisSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisSection title="Hora da Entrada">
          <EntryTimeDisplay entryTime={analysis.entryTime} recommendation={analysis.recommendation} />
        </AnalysisSection>
        <AnalysisSection title="Recomendação da IA">
           <RecommendationPill recommendation={analysis.recommendation} />
           <p className="text-xs text-gray-400 mt-2">A recomendação é válida para a vela seguinte.</p>
        </AnalysisSection>
      </div>

      <AnalysisSection title="Padrões Identificados">
        <PatternsDisplay patterns={analysis.patterns} />
      </AnalysisSection>

      <AnalysisSection title="Resumo da IA">
        <div className="flex items-start gap-4">
            <p className="text-gray-300 leading-relaxed flex-grow">{analysis.summary}</p>
            <button 
                onClick={handleReadAloud}
                disabled={playbackState === TTSPlaybackState.LOADING || playbackState === TTSPlaybackState.ERROR}
                className="flex-shrink-0 p-3 bg-gray-700 rounded-full hover:bg-indigo-600 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Ler análise em voz alta"
            >
                {playbackState === TTSPlaybackState.LOADING && <Loader size="sm" />}
                {playbackState === TTSPlaybackState.PLAYING && <IconPlaying className="w-5 h-5 text-indigo-300" />}
                {playbackState !== TTSPlaybackState.LOADING && playbackState !== TTSPlaybackState.PLAYING && <IconSpeaker className="w-5 h-5" />}
            </button>
        </div>
        {playbackState === TTSPlaybackState.ERROR && <p className="text-red-400 text-sm mt-2">Não foi possível reproduzir o áudio.</p>}
      </AnalysisSection>
    </div>
  );
};