
import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authenticated = sessionStorage.getItem('subhpass_auth') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('subhpass_auth');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-black overflow-auto pb-12">
      {/* Decorative elements */}
      <div className="scanline"></div>
      
      <div className="fixed inset-0 bg-cyber-gradient -z-10"></div>
      <div className="fixed inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10 -z-10"></div>
      
      <div className="fixed top-0 right-0 w-64 h-64 rounded-full bg-cyber-purple/5 blur-3xl -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full bg-cyber-blue/5 blur-3xl -z-10"></div>
      
      <main className="flex-1 container px-4 py-8 flex items-center justify-center">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
      
      <footer className="text-center text-muted-foreground text-xs py-4">
        <p>SubhPass • Secure Password Manager • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
