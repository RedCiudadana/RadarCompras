import React from 'react';

interface IconImageProps {
  img: React.ReactNode;
  background?: string;
}

export const IconImage: React.FC<IconImageProps> = ({
  img,
  background = 'bg-neutral'
}) => {
  const classStyle = `size-14 mx-auto mb-2 rounded-md ${background} p-2`;

  console.log(typeof img);

  if (typeof img === 'string') return (<img src={img} className={classStyle} />);

  return (
    <div className={classStyle}>
      {img}
    </div>
  )
};