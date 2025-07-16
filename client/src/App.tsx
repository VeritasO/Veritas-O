// App scaffold
import React from 'react';
import Navigation from './components/navigation';
import Home from './pages/home';
import type { Section } from './components/navigation';
// Make sure the file exists at src/pages/doctrine-history.tsx
// If the file is named differently, update the import path accordingly, for example:
import DoctrineHistory from "./pages/doctrine-history";
import { BrowserRouter, Route } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Navigation
          activeSection={'home' as Section}
          onSectionChange={(section: Section) => {
            // handle section change here
            console.log('Section changed to:', section);
          }}
        />
        <Home />
        <Route path="/doctrine-history" element={<DoctrineHistory />} />
      </div>
    </BrowserRouter>
  );
};
export default App;
