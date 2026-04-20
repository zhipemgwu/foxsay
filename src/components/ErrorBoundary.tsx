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
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          width: '100%', height: '100%', color: 'rgba(245,239,232,0.6)', padding: 32, textAlign: 'center',
        }}>
          <span style={{ fontSize: 36, marginBottom: 12 }}>😵</span>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>页面加载出错</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 20px', borderRadius: 8,
              background: 'rgba(255,138,128,0.15)', color: '#FF8A80',
              fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            点击重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
