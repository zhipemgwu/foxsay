import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { runStorageMigration } from './lib/storage'

// 启动前迁移旧 localStorage key 到 foxsay: 前缀，幂等
runStorageMigration()

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#2b2535', color: '#f5efe8', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: 32 }}>
          <span style={{ fontSize: 48, marginBottom: 16 }}>😵</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>出了点小问题</h2>
          <p style={{ color: 'rgba(245,239,232,0.6)', fontSize: 14, marginBottom: 20 }}>应用遇到了意外错误</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{ background: 'linear-gradient(135deg, #FF8A80, #FF5252)', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            重新加载
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
