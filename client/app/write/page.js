'use client';

import React from 'react';
import WriteComponent from './WriteComponent';
import ProtectedRoute from '../../components/UI/ProtectedRoute';

export default function WritePage() {
  return (
    <ProtectedRoute>
      <WriteComponent />
    </ProtectedRoute>
  );
}
