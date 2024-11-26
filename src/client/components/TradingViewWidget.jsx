import React, { useEffect, useRef, memo } from 'react';

const TradingViewWidget = memo(({ symbol = 'BTCUSDT' }) => {
  const container = useRef(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
    container.current.querySelector('div').id = containerId;
    
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          width: '100%',
          height: 400,
          symbol: `BINANCE:${symbol}`,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId
        });
      }
    };

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '<div></div>';
      }
    };
  }, [symbol]);

  return (
    <div ref={container} className="w-full h-[400px]">
      <div></div>
    </div>
  );
});

TradingViewWidget.displayName = 'TradingViewWidget';

export default TradingViewWidget;