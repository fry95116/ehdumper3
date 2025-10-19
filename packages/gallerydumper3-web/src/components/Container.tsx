import type { CommonProps } from './common';

export const Container: React.FC<React.PropsWithChildren<CommonProps>> = (props) => {
  return <div className={`${props.className} w-full max-w-7xl`}>{props.children}</div>;
};
