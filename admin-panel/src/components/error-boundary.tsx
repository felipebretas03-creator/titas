"use client"
import React, { Component, ReactNode } from "react"

export class GlobalErrorBoundary extends Component<{children: ReactNode}, {error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: '#955251', color: 'white', minHeight: '100vh', zIndex: 999999, position: 'relative' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>🚨 React Mobile Crash Log 🚨</h2>
          <p>Tire um print desta tela para eu consertar o erro!</p>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', marginTop: '20px', borderRadius: '8px', overflowX: 'auto', fontSize: '11px', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </pre>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', marginTop: '10px', borderRadius: '8px', overflowX: 'auto', fontSize: '10px', whiteSpace: 'pre-wrap' }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
