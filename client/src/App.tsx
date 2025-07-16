// App scaffold
import React from 'react';
import Navigation from './components/navigation';
import Home from './pages/home';
import type { Section } from './components/navigation';
import DoctrineHistory from "@/pages/doctrine-history";

<Route path="/doctrine-history" component={DoctrineHistory} />

const App: React.FC = () => {
  return (
    <div>
      <Navigation
        activeSection={'home' as Section}
        onSectionChange={(section: Section) => {
          // handle section change here
          console.log('Section changed to:', section);
        }}
      />
      <Home />
    </div>
  );
};

export default App;
