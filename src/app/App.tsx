import { useEffect } from 'react';
import { slides } from '../content';
import { EditModeProvider } from '../edit/EditMode';
import { initEdits } from '../edit/editsStore';
import { Deck } from './Deck';
import { PrintView } from './PrintView';

export function App() {
  const print = new URLSearchParams(window.location.search).has('print');
  useEffect(() => { void initEdits(); }, []);
  return (
    <EditModeProvider>
      {print ? <PrintView slides={slides} /> : <Deck slides={slides} />}
    </EditModeProvider>
  );
}
