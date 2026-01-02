import React from 'react';
import { createRoot } from 'react-dom/client';
import EvidenraApp from './App';
import { GenesisSyncProvider, CloudLoginModal, CloudSyncStatusModal } from './providers/GenesisSyncProvider';
import './styles.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(
  <GenesisSyncProvider>
    <EvidenraApp />
    <CloudLoginModal />
    <CloudSyncStatusModal />
  </GenesisSyncProvider>
);