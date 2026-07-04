import React from 'react';
import { Kanban } from 'lucide-react';
import Board from './components/Board/Board';
import styles from './App.module.css';

function App() {
  const handleAddTask = (columnId) => {
    console.log('Add task in column:', columnId);
  };

  const handleEditTask = (task) => {
    console.log('Edit task:', task);
  };

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
        <Board 
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
        />
      </main>
    </div>
  );
}

export default App;
