//import React from 'react';

const FrmBrowserWarning = () => {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  if (!isChrome) {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Warning:</strong> For the best experience, we recommend using <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer">Google Chrome</a>.
      </div>
    );
  }

  return null;
};

export default FrmBrowserWarning;
