import React from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconImage } from '../ui/IconImage';

interface NotificationCtaSectionProps {
  onSubscribe?: (email: string) => void;
  onSkip?: () => void;
}

export const NotificationCtaSection: React.FC<NotificationCtaSectionProps> = ({
  onSubscribe,
  onSkip
}) => {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubscribe?.(email);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-gray-100 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-sky rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="flex justify-center mb-6">
            <IconImage img='/iconos/search-white.png' background='bg-white/20' />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Recibe Alertas de Nuevas <br></br> Oportunidades
          </h2>

          <p className="text-white/95 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Suscríbete para recibir notificaciones de procesos de contratación relevantes para tu empresa según sector, institución y monto de interés
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <Button
                type="submit"
                variant="blue"
              >
                Suscribirse
                <ArrowRight size={13}/>
              </Button>
            </div>
          </form>

          {onSkip && (
            <button
              onClick={onSkip}
              className="mt-6 text-white/80 hover:text-white text-sm transition"
            >
              Saltarse por ahora
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
