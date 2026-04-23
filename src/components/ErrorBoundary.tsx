/**
 * @file ErrorBoundary.tsx
 * @desc 全局错误边界 — 捕获 lazy 加载失败和渲染崩溃
 */
import { Component, ReactNode } from 'react';

interface Props {
  fallback?: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errMsg: string;
  errStack: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errMsg: '', errStack: '' };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errMsg: error?.message || String(error),
      errStack: error?.stack || '',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.setState({ errStack: (error?.stack || '') + '\n\n' + (info?.componentStack || '') });
  }

  handleReset = () => {
    this.setState({ hasError: false, errMsg: '', errStack: '' });
  };

  handleClearCache = () => {
    if (!confirm('将清除本地缓存并刷新页面（不影响账号）。确定继续？')) return;
    try {
      // 只清 foxsay 相关 key，避免误伤
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('foxsay') || k.startsWith('foxsay:'))) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    } catch {}
    location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: '100%', minHeight: '100%', color: 'rgba(245,239,232,0.8)', padding: 24, textAlign: 'center',
        }}>
          <span style={{ fontSize: 36, marginBottom: 12 }}>😵</span>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>页面加载出错</p>
          {this.state.errMsg && (
            <pre style={{
              fontSize: 11, color: 'rgba(255,138,128,0.9)', background: 'rgba(0,0,0,0.25)',
              padding: 10, borderRadius: 8, maxWidth: 320, maxHeight: 120, overflow: 'auto',
              textAlign: 'left', whiteSpace: 'pre-wrap', marginBottom: 12,
            }}>{this.state.errMsg}</pre>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'rgba(255,138,128,0.15)', color: '#FF8A80',
                fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}
            >
              点击重试
            </button>
            <button
              onClick={this.handleClearCache}
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: 'rgba(245,239,232,0.12)', color: 'rgba(245,239,232,0.9)',
                fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              }}
            >
              清除缓存并刷新
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
