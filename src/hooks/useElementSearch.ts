import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useStore } from '../store/useStore';
import { bnNames, latinNames } from '../constants/elements';
import { ElementData } from '../types';

export const useElementSearch = (query: string) => {
  const { elements, setLanguage } = useStore();

  const enrichedElements = useMemo(() => {
    return elements.map(el => ({
      ...el,
      nameEn: el.name,
      nameBn: bnNames[el.symbol] || '',
      latinName: latinNames[el.symbol] || '',
      atomic_number: el.atomicNumber, // support user's preferred field name
    }));
  }, [elements]);

  const fuse = useMemo(() => {
    return new Fuse(enrichedElements, {
      keys: [
        'nameEn',
        'nameBn',
        'symbol',
        'latinName',
        'atomicNumber',
        'atomic_number'
      ],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      includeMatches: true,
    });
  }, [enrichedElements]);

  const results = useMemo(() => {
    if (!query) return [];
    
    // Check if query is purely numeric
    if (/^\d+$/.test(query)) {
      const num = parseInt(query);
      const exact = enrichedElements.find(el => el.atomicNumber === num);
      if (exact) return [exact];
    }

    return fuse.search(query).map(result => result.item);
  }, [query, fuse, enrichedElements]);

  return results as ElementData[];
};
