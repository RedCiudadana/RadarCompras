import React from 'react';

interface IconImageProps {
  img: string;
  background?: string;
}

export const IconImage: React.FC<IconImageProps> = ({
  img,
  background = 'bg-neutral'
}) => {
  const classStyle = `size-14 mx-auto mb-2 rounded-md ${background} p-2`;

  return (<img src={img} className={classStyle} />)
};