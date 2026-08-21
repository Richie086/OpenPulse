import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("OpenPulse React Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-slate-950 text-white p-6 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-lg shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">Application Render Failure</h2>
            <p className="text-xs text-slate-300 mb-4 font-mono">
              {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Reload OpenPulse
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
