// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/ProtectedRoute.tsx

import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  isAllowed: boolean;
  redirectPath?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, isAllowed, redirectPath = '/auth' }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;
