import React, { CanvasHTMLAttributes, DetailedHTMLProps, FC } from 'react';

import { useCanvas } from '../hooks';
import { CanvasDrawFn } from '../types';

interface ICanvasProps
  extends DetailedHTMLProps<
    CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  draw: CanvasDrawFn;
}

const Canvas: FC<ICanvasProps> = (props) => {
  const { ref } = useCanvas(props.draw);

  const canvasProps = { ...props, draw: undefined };
  return <canvas ref={ref} {...canvasProps} />;
};

export default Canvas;
