import { Navigate, Route, Routes } from 'react-router-dom';

import routes from '..';
import { Pages as PageKeys } from '../types';
import { mountedRoutes } from '../utils';

function Pages() {
  return (
    <Routes>
      {/* `/` is not a page of its own — the feed is the home of the app. */}
      <Route path="/" element={<Navigate to={routes[PageKeys.Card].path} replace />} />
      {mountedRoutes().map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}

export default Pages;
