import { Component } from 'react';
import { createPortal } from 'react-dom';

// The implementation of using react dom. Create portal
export function ShadowContent({ root, children }: { root: Element, children: React.ReactNode }) {
  return createPortal(children, root);
}

export class ShadowView extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = { root: null };

  setRoot = (element: HTMLDivElement) => {
    if (!element) {
      return;
    }

    const root = element.attachShadow({ mode: 'open' });
    this.setState({ root });
  };

  render() {
    // eslint-disable-next-line react/prop-types
    const { children } = this.props;
    const { root } = this.state;
    return (
      <div ref={this.setRoot}>
        {root && (
          <ShadowContent root={root}>
            {children}
          </ShadowContent>
        )}
      </div>
    );
  }
}
