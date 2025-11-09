
import React from 'react';

export const IconUpload: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const IconX: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const IconSpeaker: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

export const IconPlaying: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="y2" values="20;4;20" dur="1.2s" repeatCount="indefinite"></animate>
            </line>
            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="y2" values="4;20;4" dur="1.2s" repeatCount="indefinite"></animate>
            </line>
            <line x1="18" y1="4" x2="18" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <animate attributeName="y2" values="20;4;20" dur="1.2s" repeatCount="indefinite"></animate>
            </line>
        </g>
    </svg>
);

export const IconChart: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const IconGemini: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M426.667 938.667C224 938.667 64 778.667 64 576C64 373.333 224 213.333 426.667 213.333C480.245 213.333 531.435 224.213 576 242.773V149.333C576 102.4 614.4 64 661.333 64C708.267 64 746.667 102.4 746.667 149.333V576C746.667 622.933 708.267 661.333 661.333 661.333C614.4 661.333 576 622.933 576 576V490.667C531.627 469.333 480.725 458.667 426.667 458.667C341.333 458.667 277.333 522.667 277.333 576C277.333 629.333 341.333 693.333 426.667 693.333C512 693.333 576 629.333 576 576H661.333C661.333 778.667 821.333 938.667 960 938.667L874.667 853.333C789.333 896 661.333 938.667 426.667 938.667Z" fill="url(#paint0_linear_2_11)"/>
        <defs>
            <linearGradient id="paint0_linear_2_11" x1="64" y1="64" x2="960" y2="938.667" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9958F1"/>
            <stop offset="0.25" stopColor="#6469F5"/>
            <stop offset="0.5" stopColor="#3DA0F3"/>
            <stop offset="0.75" stopColor="#67E9CE"/>
            <stop offset="1" stopColor="#AEF2A1"/>
            </linearGradient>
        </defs>
    </svg>
);

export const IconArrowUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

export const IconArrowDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const IconClock: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IconUser: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
  
export const IconCheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
