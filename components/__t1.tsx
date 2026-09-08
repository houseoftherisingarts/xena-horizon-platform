import React from 'react';
interface EtatErreur { aPlante: boolean; }
export class ErreurRacine extends React.Component<React.PropsWithChildren, EtatErreur> {
  state: EtatErreur = { aPlante: false };
  render() {
    return this.props.children;
  }
}
