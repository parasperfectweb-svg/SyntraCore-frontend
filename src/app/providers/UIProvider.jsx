// app/providers/UIProvider.jsx
// Sidebar-open state lives in redux/slices/uiSlice.js. This context is
// for lightweight, app-wide UI concerns that DO need a provider —
// currently just toasts.
import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, variant = 'primary') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast show align-items-center text-white bg-${t.variant} border-0 mb-2`}>
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a UIProvider');
  return ctx;
}
