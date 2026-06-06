import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { ProcessesClosingSoonSection } from './ProcessesClosingSoonSection';
import { OpportunitiesSection } from './OpportunitiesSection';
import { RecentBiddingsSection } from './RecentBiddingsSection';
import { SectorComparisonSection } from './SectorComparisonSection';
import { NotificationCtaSection } from './NotificationCtaSection';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutInitiativeSection } from './AboutInitiativeSection';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/busqueda?q=${encodeURIComponent(query)}`);
  };

  const handleHeroCTA = (action: string) => {
    if (action === 'search') {
      navigate('/busqueda');
    } else if (action === 'opportunities') {
      navigate('/oportunidades');
    }
  };

  const handleViewAll = (section: string) => {
    navigate(`/busqueda?section=${section}`);
  };

  const handleSubscribe = (email: string) => {
    console.log('Subscribe:', email);
    // TODO: Implement subscription
  };

  const handleSelectProcess = (id: string) => {
    navigate(`/busqueda/${id}`);
  };

  const handleSelectBidding = (id: string) => {
    navigate(`/busqueda/${id}`);
  };

  const handleSelectSector = (sectorId: string) => {
    navigate(`/busqueda?sector=${sectorId}`);
  };

  return (
    <div className="space-y-0">
      <HeroSection
        onSearch={handleSearch}
        onCTAClick={handleHeroCTA}
      />

      <ProcessesClosingSoonSection
        onViewAll={() => handleViewAll('closing-soon')}
        onSelectProcess={handleSelectProcess}
      />

      <OpportunitiesSection
        onViewAll={() => handleViewAll('opportunities')}
        onSelectOpportunity={handleSelectProcess}
      />

      <RecentBiddingsSection
        onViewAll={() => handleViewAll('recent')}
        onSelectBidding={handleSelectBidding}
      />

      <SectorComparisonSection
        onSelectSector={handleSelectSector}
      />

      <NotificationCtaSection
        onSubscribe={handleSubscribe}
      />

      <HowItWorksSection />

      <AboutInitiativeSection />
    </div>
  );
};