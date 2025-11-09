import type { AnalysisResult } from './types';

export const sampleAnalysis: AnalysisResult = {
  asset: "EUR/USD (Demonstração)",
  timeframe: "4 Horas (H4)",
  patterns: [
    "Padrão de Engolfo de Alta",
    "Rebote no Nível de Suporte",
    "Saída de Sobrevenda do IFR"
  ],
  summary: "O gráfico mostra um forte sinal de reversão de alta. Um padrão de engolfo proeminente em um nível de suporte chave sugere que a pressão de compra está aumentando para o próximo período. O IFR saindo da sobrevenda corrobora um potencial movimento ascendente. A recomendação de compra é para a abertura da vela seguinte à hora de entrada, com um stop-loss posicionado abaixo da mínima recente.",
  entryTime: {
    main: "18:00 (UTC-3)",
    reentries: ["18:05", "18:10"],
  },
  recommendation: "Compra"
};