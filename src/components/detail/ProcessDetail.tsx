import React from 'react';
import { ArrowLeft, Building2, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Release } from '../../types/ocds';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

interface ProcessDetailProps {
  release?: Release;
  onBack?: () => void;
}

export const ProcessDetail: React.FC<ProcessDetailProps> = ({ release, onBack }) => {
  if (!release) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontró información del proceso</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {release.tender?.title || 'Proceso sin título'}
        </h1>
        <p className="mt-2 text-gray-600 font-mono text-sm">OCID: {release.ocid}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información del Comprador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="font-semibold text-gray-900">{release.buyer?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-mono text-sm text-gray-900">{release.buyer?.id || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {release.tender && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Información del Tender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="text-gray-900 mt-1">
                  {release.tender.description || 'No disponible'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Monto</p>
                  <p className="font-semibold text-lg text-gray-900">
                    {formatCurrency(release.tender.value?.amount || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  {release.tender.status && (
                    <Badge variant={getStatusColor(release.tender.status) as any}>
                      {release.tender.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Método de Contratación</p>
                  <p className="text-gray-900">
                    {release.tender.procurementMethod || 'N/A'}
                  </p>
                </div>
              </div>

              {release.tender.tenderPeriod && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Período del Tender</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Inicio: </span>
                      <span className="text-gray-900">
                        {formatDate(release.tender.tenderPeriod.startDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fin: </span>
                      <span className="text-gray-900">
                        {formatDate(release.tender.tenderPeriod.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
