import React from 'react';
import { ArrowRight, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { IconImage } from '../ui/IconImage';

interface NotificationCtaSectionProps {
  onSkip?: () => void;
}

export const NotificationCtaSection: React.FC<NotificationCtaSectionProps> = ({
  onSkip
}) => {
  const [email, setEmail] = React.useState('');
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [sitekey, setSitekey] = React.useState<string>(
    () => (window as any).__rcSitekey || ''
  );

  React.useEffect(() => {
    if (sitekey) return;
    const id = setInterval(() => {
      const key = (window as any).__rcSitekey;
      if (key) { setSitekey(key); clearInterval(id); }
    }, 100);
    return () => clearInterval(id);
  }, [sitekey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const myForm = event?.target as HTMLFormElement;
    const formData = new FormData(myForm);

    if (email) {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(Array.from(formData.entries()) as string[][]).toString()
      })
        .then(() => setSubmitSuccess(true))
        .catch(error => setSubmitError(true));
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
            Recibe actualización de proyectos
          </h2>

          <p className="text-white/95 mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Suscríbete para recibir notificaciones de nuevas herramientas para busqueda de contrataciones relevantes para tu empresa según sector.
          </p>

          {!submitSuccess && (
            <form 
              onSubmit={handleSubmit}
              className="max-w-xl w-full mx-auto"
              data-netlify="true"
            >
              <input type="hidden" name="form-name" value="subscription_herramientas_ocds" />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  name="email"
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
              {sitekey && <div className="g-recaptcha mt-6 mx-auto" data-sitekey={sitekey}></div>}
            </form>
          )}

          {submitError && (
            <p className="p-2 rounded-lg text-center bg-red-100 border border-red-400 text-red-700 w-fit mb-8 max-w-2xl mx-auto text-sm md:text-base mt-2">
              Ocurrió un error.
            </p>
          )}

          {submitSuccess && (
            <p className="bg-white px-4 py-3 text-center rounded-xl font-bold text-rc-text-base mb-8 max-w-2xl mx-auto text-sm md:text-base">
              Gracias por suscribirte!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
