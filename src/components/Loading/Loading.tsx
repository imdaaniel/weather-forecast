import { ReactNode } from 'react';
import './style.css';

type Props = {
  children: ReactNode;
  isLoading: boolean;
  id?: string;
}

function Loading({children, isLoading, id}: Props) {
  return (
    <span id={id} className={isLoading ? 'loading' : ''}>{children}</span>
  );
}

export default Loading;