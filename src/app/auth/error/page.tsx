'use client';
import React, { Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { OrbitProgress } from "react-loading-indicators";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <OrbitProgress variant="track-disc" dense color="#33539B" size="medium" />
  </div>
);
const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>An error occurred: {error}</p>
    </div>
  );
}
const ErrorPagePage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ErrorPage />
    </Suspense>
  );
};

export default ErrorPagePage;
