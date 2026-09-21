import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InstallSteps from './components/InstallSteps';
import Footer from './components/Footer';
import QRModal from './components/QRModal';

export default function App() {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/downloads/netplixx-v1.0.0.apk';
    link.download = 'netplixx-v1.0.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Clean Navbar */}
      <Navbar onDownloadClick={triggerDownload} />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        {/* Focused Hero with live screenshot & download options */}
        <Hero
          onOpenQr={() => setQrModalOpen(true)}
          onDownloadClick={triggerDownload}
        />

        {/* 3-Step Simple Install Guide for APK */}
        <InstallSteps onDownloadClick={triggerDownload} />
      </main>

      {/* Quiet Footer */}
      <Footer onDownloadClick={triggerDownload} />

      {/* QR Code Scanner Dialog */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
}
