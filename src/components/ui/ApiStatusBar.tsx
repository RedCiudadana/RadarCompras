import React, { useEffect, useState } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { OCDSApi } from '../../services/ocdsApi';

export const ApiStatusBar: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline' | 'error'>('checking');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
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
        setLastUpdate(new Date());
        setResponseTime(endTime - startTime);
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('offline');
      setResponseTime(null);
    }
  };

  const getStatusConfig = () => {
    switch (apiStatus) {
      case 'online':
        return {
          icon: CheckCircle2,
          text: 'API OCDS Activo',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'offline':
        return {
          icon: XCircle,
          text: 'API OCDS Inactivo',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'API OCDS con Errores',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      default:
        return {
          icon: Activity,
          text: 'Verificando API...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg px-4 py-2.5 mb-6`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-5 h-5 ${config.color} ${apiStatus === 'checking' ? 'animate-pulse' : ''}`} />
          <span className={`font-semibold ${config.color}`}>{config.text}</span>

          {responseTime && (
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {responseTime}ms
            </span>
          )}
        </div>

        {lastUpdate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              Última actualización: {formatDistanceToNow(lastUpdate, {
                addSuffix: true,
                locale: es
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
