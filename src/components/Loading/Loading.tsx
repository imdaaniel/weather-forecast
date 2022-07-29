import { ReactNode } from 'react';
import './style.css';

type Props = {
  children?: ReactNode;
  isLoading: boolean;
  id?: string;
  tag?: string;
}

function Loading({children, isLoading, id, tag}: Props) {
  const Tag = `${tag ?? 'span'}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={isLoading ? 'loading' : ''}>{children}</Tag>
  );
}

export default Loading;