import React from 'react';

type ConnectionStateProps = {
    isConnected: any;
  };
export function ConnectionState({ isConnected }:ConnectionStateProps) {
  return <p>State: { '' + isConnected }</p>;
}