import { useInViewport, useMemoizedFn } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CommonProps } from './common';
import { Button } from 'flowbite-react';

export const LoadMore: React.FC<CommonProps> = () => {
  const ref = useRef(null);
  const [inViewport] = useInViewport(ref);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const doFetch = useMemoizedFn(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 5000));
    // TODO: 打断
    setError(Math.random() > 0.5);
    setLoading(false);
  });

  useEffect(() => {
    if (inViewport) {
      doFetch();
    }
  }, [inViewport]);

  const contentNode = useMemo(() => {
    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return (
        <div className="flex flex-row items-center justify-start">
          <div className="mr-2">Error: </div>
          <Button>Refresh</Button>
        </div>
      );
    }
    return <Button>LoadMore</Button>;
  }, [loading, error]);

  return (
    <div
      className="flex w-full flex-col items-center justify-center p-6 text-white"
      ref={ref}
    >
      {contentNode}
    </div>
  );
};
