import { createFileRoute } from '@tanstack/react-router';
import type React from 'react';
import { Container } from '../components/Container';
import { useResponsive } from 'ahooks';
import { useMemo } from 'react';
import { LoadMore } from '../components/LoadMore';
import { MOCK_ITEMS } from '../fixtures/gallery';

const Card: React.FC<{ cover?: string; name?: string }> = (props) => {
  // const height = useMemo(() => 200 + 200 * Math.random(), []);
  return (
    <div className="flex w-full flex-col items-start justify-center">
      <div className="w-full overflow-hidden rounded-sm bg-blue-600">
        <img className="w-full" src={props.cover} />
      </div>
      <div
        className="line-clamp-2 w-full overflow-hidden p-1 text-start
          whitespace-break-spaces text-white"
      >
        <div
          className="relative top-[3px] mr-2 inline-block h-4 w-4 rounded-full bg-red-600"
        ></div>
        {props.name}
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  const items = useMemo(
    () =>
      MOCK_ITEMS.map((item) => (
        <Card
          key={item.gid}
          cover={`https://192.168.2.232:8000/img/${item.coverUrl}`}
          name={item.name}
        />
      )),
    []
  );
  const { sm, md, lg, xl } = useResponsive();

  const columns = useMemo(() => {
    if (xl) return 6;
    if (lg) return 4;
    if (md) return 3;
    if (sm) return 2;
    return 2;
  }, [sm, md, lg, xl]);

  const columnNodes = useMemo(() => {
    return Array.from({ length: columns }, (_, i) => {
      let p = 'px-1';
      if (i === 0) {
        p = 'pr-1';
      } else if (i === columns - 1) {
        p = 'pl-1';
      }
      return (
        <div key={i} className={`w-1/${columns} ${p}`}>
          <div className={'flex flex-col items-center justify-start'}>
            {items.filter((_, j) => j % columns === i)}
          </div>
        </div>
      );
    });
  }, [columns]);
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <Container className="flex flex-col items-start justify-start">
        <div className="mb-2 flex h-32 w-full rounded-sm bg-gray-600"></div>
        <div className="flex w-full flex-row items-start justify-center">
          {columnNodes}
        </div>
      </Container>
      <LoadMore />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: IndexPage,
});
