import React from 'react';
export class Foo extends React.Component<{}, {}> {
  render() {
    return this.props.children;
  }
}
