import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { OCDSApi } from '../../services/ocdsApi';

export const ApiStatusBar: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    const startTime = Date.now();
    try {
      const { data } = await OCDSApi.searchReleases({}, 1, 1);
      const endTime = Date.now();

      if (data && data.length >= 0) {
        setApiStatus('online');
        setResponseTime(endTime - startTime);
      } else {
        setApiStatus('error');
        setResponseTime(null);
      }
    } catch {
      setApiStatus('offline');
      setResponseTime(null);
    }
  };

  const getStatusConfig = () => {
    switch (apiStatus) {
      case 'online':
        return {
          icon: CheckCircle2,
          text: 'Guatecompras OCDS en línea',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'offline':
        return {
          icon: XCircle,
          text: 'Guatecompras OCDS sin conexión',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Guatecompras OCDS con errores',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      default:
        return {
          icon: Activity,
          text: 'Verificando conexión...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-2 mb-3">
      <StatusIcon
        className={`w-3.5 h-3.5 ${config.color} ${apiStatus === 'checking' ? 'animate-pulse' : ''}`}
      />
      <span className={`text-xs font-medium ${config.color}`}>{config.text}</span>
      {responseTime !== null && (
        <span className="text-xs text-gray-400">{responseTime}ms</span>
      )}
    </div>
  );
};
