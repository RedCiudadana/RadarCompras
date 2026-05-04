import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { Release } from '../../types/ocds';
import {
  CompanySize,
  OpportunitiesParams,
  RecommenderAPI,
  opportunitiesParamsFromSearchParams,
  opportunitiesParamsToSearchParams,
} from '../../services/recommender';
import { Stepper } from './wizard/Stepper';
import { StepCategories } from './wizard/StepCategories';
import { StepKeywords } from './wizard/StepKeywords';
import { StepCompanySize } from './wizard/StepCompanySize';
import { OpportunitiesResults } from './OpportunitiesResults';

const STEP_LABELS = ['Actividad', 'Palabras clave', 'Tamaño'];

type Mode = 'wizard' | 'loading' | 'results' | 'error';

export const OpportunitiesRadar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [mode, setMode] = useState<Mode>('wizard');
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [size, setSize] = useState<CompanySize | null>(null);
  const [results, setResults] = useState<Release[]>([]);
  const [error, setError] = useState<string | undefined>();

  const abortRef = useRef<AbortController | null>(null);
  const lastParamsRef = useRef<OpportunitiesParams | null>(null);

  // Run recommender for a given OpportunitiesParams
  const runRecommender = async (params: OpportunitiesParams) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastParamsRef.current = params;

    setMode('loading');
    setError(undefined);
    try {
      const { data } = await RecommenderAPI.findOpportunities(params, controller);
      if (controller.signal.aborted) return;
      setResults(data);
      setMode('results');
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
      console.error('Error finding opportunities:', e);
      setError('No pudimos cargar las oportunidades. Intenta de nuevo.');
      setMode('error');
    }
  };

  // Mount: read URL params, decide between wizard or results
  useEffect(() => {
    const parsed = opportunitiesParamsFromSearchParams(searchParams);
    if (parsed) {
      setCategories(parsed.categories);
      setKeywords(parsed.keywords);
      setSize(parsed.companySize);
      runRecommender(parsed);
    } else {
      // Strip any partial/invalid params so the URL is clean while in wizard
      if (searchParams.toString().length > 0) {
        setSearchParams({}, { replace: true });
      }
      setMode('wizard');
    }
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAdvance = (() => {
    if (step === 0) return categories.length > 0;
    if (step === 1) return true; // keywords optional
    if (step === 2) return size !== null;
    return false;
  })();

  const handleNext = () => {
    if (!canAdvance) return;
    if (step < 2) {
      setStep((s) => (s + 1) as 0 | 1 | 2);
      return;
    }
    if (size === null) return;
    const params: OpportunitiesParams = { categories, keywords, companySize: size };
    setSearchParams(opportunitiesParamsToSearchParams(params));
    runRecommender(params);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => (s - 1) as 0 | 1 | 2);
  };

  const handleEdit = () => {
    abortRef.current?.abort();
    setSearchParams({}, { replace: true });
    setMode('wizard');
    setStep(0);
  };

  const handleRetry = () => {
    if (lastParamsRef.current) {
      runRecommender(lastParamsRef.current);
    }
  };

  if (mode === 'loading' || mode === 'results' || mode === 'error') {
    const params: OpportunitiesParams = lastParamsRef.current ?? {
      categories,
      keywords,
      companySize: size ?? 'small',
    };
    return (
      <div className="space-y-4">
        <ApiStatusBar />
        {mode === 'error' ? (
          <div className="bg-white border border-rc-border rounded-lg p-6 text-center space-y-3">
            <p className="text-sm text-rc-text-base">{error}</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleRetry}
                className="px-3 py-2 text-sm font-medium text-white bg-rc-primary rounded hover:bg-rc-primary/90 transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-2 text-sm font-medium text-rc-primary border border-rc-primary rounded hover:bg-rc-primary hover:text-white transition-colors"
              >
                Editar criterios
              </button>
            </div>
          </div>
        ) : (
          <OpportunitiesResults
            params={params}
            releases={results}
            loading={mode === 'loading'}
            onEdit={handleEdit}
          />
        )}
      </div>
    );
  }

  // Wizard mode
  return (
    <div className="space-y-4">
      <ApiStatusBar />

      <div className="bg-white border border-rc-border rounded-lg p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-rc-text-base">Configura tu radar</h1>
          <p className="text-sm text-rc-text-muted mt-1">
            Cuéntanos sobre tu empresa para encontrar oportunidades relevantes.
          </p>
        </div>

        <Stepper steps={STEP_LABELS} current={step} />

        <div>
          {step === 0 && <StepCategories value={categories} onChange={setCategories} />}
          {step === 1 && <StepKeywords value={keywords} onChange={setKeywords} />}
          {step === 2 && <StepCompanySize value={size} onChange={setSize} />}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-rc-border">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rc-text-muted border border-rc-border rounded hover:border-rc-primary hover:text-rc-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rc-border disabled:hover:text-rc-text-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-rc-primary rounded hover:bg-rc-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 2 ? (
              <>
                <Search className="w-4 h-4" />
                Encontrar oportunidades
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
