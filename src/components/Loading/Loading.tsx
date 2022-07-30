import './style.css';

type Props = {
  isLoading: boolean;
  tag?: string;
} & Record<string, any>

function Loading(props: Props) {
  const { children, isLoading, tag, ...otherProps} = props;
  const Tag = `${tag ?? 'span'}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={isLoading ? 'loading' : ''} {...otherProps}>{children}</Tag>
  );
}

export default Loading;