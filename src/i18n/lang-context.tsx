'use client';

import { createContext, useContext } from 'react';
import { MESSAGES, type Messages } from './messages';

export const LangContext = createContext<Messages>(MESSAGES.en);

export function useMessages(): Messages {
  return useContext(LangContext);
}
