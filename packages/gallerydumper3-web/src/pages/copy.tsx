import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { Container } from '../components/Container';

import { LoadMore } from '../components/LoadMore';

const IndexPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Container className="flex flex-col items-start justify-start">
        <div className="mb-2 flex h-32 w-full rounded-sm bg-gray-600">copy page</div>
      </Container>
      <LoadMore />
    </div>
  );
};

export const Route = createFileRoute('/copy')({
  component: IndexPage,
});
