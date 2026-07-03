import React from 'react';
import { Kanban } from 'lucide-react';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.appContainer}>
      <header className={`${styles.appHeader} glass-header`}>
        <div className={styles.titleContainer}>
          <div className={styles.logo}>
            <Kanban size={28} strokeWidth={2.5} />
          </div>
          <h1 className={styles.logoText}>KanBan</h1>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>
          🤖 Developed by Antigravity AI
        </div>
      </header>
      <main className={styles.appMain}>
        <div className="glass-panel" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-sm)' }}>
            Welcome to the Kanban Board!
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Scaffolding is completed. The next phase will build state management and load the data layer.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
