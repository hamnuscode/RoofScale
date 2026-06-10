import { Component } from 'react'

/* Wraps optional 3D/canvas content. If WebGL is unavailable or the scene
   throws, we render the fallback (or nothing) instead of crashing the page. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('[3d] disabled after error:', err?.message || err)
  }
  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
