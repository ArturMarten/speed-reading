import React from 'react';
import ReactLoadable from 'react-loadable';
import { Loader } from 'semantic-ui-react';

const Loading = () => <Loader active size="massive" indeterminate />;

export default function Loadable(opts) {
  return ReactLoadable(Object.assign({
    loading: Loading,
    delay: 100,
  }, opts));
}
