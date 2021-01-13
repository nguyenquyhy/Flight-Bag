import * as React from 'react';

export class Layout extends React.Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
