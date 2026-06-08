import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { ProcessesClosingSoonSection } from './ProcessesClosingSoonSection';
import { RecentBiddingsSection } from './RecentBiddingsSection';
import { SectorComparisonSection } from './SectorComparisonSection';
import { NotificationCtaSection } from './NotificationCtaSection';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutInitiativeSection } from './AboutInitiativeSection';
import { OCDSApi } from '../../services/ocdsApi';
import { Release } from '../../types/ocds';

// Compra Directa (Art. 43 b) + Compra de Baja Cuantía — 1-day windows = closing soon.
const CLOSING_SOON_MODALIDADES = ['1', '33'];
// Cotización (Art. 38) + Licitación Pública (Art. 17).
const RECENT_BIDDING_MODALIDADES = ['3', '4'];
const SECTION_CAP = 6;

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const [closingSoon, setClosingSoon] = useState<Release[]>([]);
  const [closingSoonLoading, setClosingSoonLoading] = useState(true);
  const [recentBiddings, setRecentBiddings] = useState<Release[]>([]);
  const [recentBiddingsLoading, setRecentBiddingsLoading] = useState(true);

  // Compras directas (modalidades 1, 33). The OCDS API accepts one modalidad per
  // call, so we fan out and merge client-side; Estatus=Vigente and current month
  // are searchReleases defaults.
  useEffect(() => {
    const abortController = new AbortController();
    const load = async () => {
      setClosingSoonLoading(true);
      try {
        const results = await Promise.all(
          CLOSING_SOON_MODALIDADES.map((modalidad) =>
            OCDSApi.searchReleases({ modalidad }, 1, 50, abortController)
          )
        );
        setClosingSoon(results.flatMap((r) => r.data).slice(0, SECTION_CAP));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error loading closing-soon processes:', error);
          setClosingSoon([]);
        }
      } finally {
        setClosingSoonLoading(false);
      }
    };
    load();
    return () => abortController.abort();
  }, []);

  // Cotizaciones + licitaciones (modalidades 3, 4), merged client-side.
  useEffect(() => {
    const abortController = new AbortController();
    const load = async () => {
      setRecentBiddingsLoading(true);
      try {
        const results = await Promise.all(
          RECENT_BIDDING_MODALIDADES.map((modalidad) =>
            OCDSApi.searchReleases({ modalidad }, 1, 50, abortController)
          )
        );
        setRecentBiddings(results.flatMap((r) => r.data).slice(0, SECTION_CAP));
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error loading recent biddings:', error);
          setRecentBiddings([]);
        }
      } finally {
        setRecentBiddingsLoading(false);
      }
    };
    load();
    return () => abortController.abort();
  }, []);

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
        processes={closingSoon}
        isLoading={closingSoonLoading}
        onViewAll={() => handleViewAll('closing-soon')}
        onSelectProcess={handleSelectProcess}
      />

      {/* <OpportunitiesSection
        onViewAll={() => handleViewAll('opportunities')}
        onSelectOpportunity={handleSelectProcess}
      /> */}

      <RecentBiddingsSection
        biddings={recentBiddings}
        isLoading={recentBiddingsLoading}
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