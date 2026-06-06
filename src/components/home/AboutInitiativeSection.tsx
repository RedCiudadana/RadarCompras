import React from 'react';

interface AboutInitiativeSectionProps {
  title?: string;
  description?: string;
}


export const AboutInitiativeSection: React.FC<AboutInitiativeSectionProps> = ({
  title = 'Sobre esta Iniciativa',
  description = 'Radar de Compras Públicas es una plataforma desarrollada por Red Ciudadana para democratizar el acceso a la información de contratación pública en Guatemala. Creemos que la transparencia en las compras públicas es fundamental para fortalecer la democracia, combatir la corrupción y generar oportunidades de negocio para todos.',
}) => {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto p-8 md:p-12 bg-sky-neutral flex gap-6 rounded-md">
        <img src='/iconos/papers-2.png' className='size-20 flex-initial' />
        <div className='flex-1 text-rc-text-base'>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
          <p className="text-md leading-relaxed mb-6">{description}</p>
        </div>
      </div>
    </section>
  );
};
