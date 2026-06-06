import React from "react";
import { IconImage } from "../ui/IconImage";

interface HowItWorksSectionProps {}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  return (
    <section className="w-full flex flex-wrap">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white mx-auto rounded-3xl mb-36 px-8 py-16">
          <IconImage img="/iconos/work.png" />
          <div className="text-center mb-12 mt-3">
            <h2 className="text-2xl font-bold text-rc-text-base mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              El Radar de Compras Públicas te ayuda a identificar y aprovechar
              <br/> oportunidades de negocio con el Estado
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <div className="flex-1 text-center">
              <img src="/iconos/radar.png" className="bg-neutral p-2 rounded-full size-16 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-black">1. Explora</h4>
              <p className="text-sm text-rc-text-base">Busca procesos de contratación por sector, institución, monto o ubicación que se ajusten a tu perfil empresarial</p>
            </div>
            <div className="flex-1 text-center">
              <img src="/iconos/radar.png" className="bg-neutral p-2 rounded-full size-16 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-black">1. Explora</h4>
              <p className="text-sm text-rc-text-base">Busca procesos de contratación por sector, institución, monto o ubicación que se ajusten a tu perfil empresarial</p>
            </div>
            <div className="flex-1 text-center">
              <img src="/iconos/participa.png" className="bg-neutral p-2 rounded-full size-16 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-black">1. Explora</h4>
              <p className="text-sm text-rc-text-base">Busca procesos de contratación por sector, institución, monto o ubicación que se ajusten a tu perfil empresarial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
