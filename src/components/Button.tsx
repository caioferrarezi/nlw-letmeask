import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  outlined?: boolean
};

export function Button({ outlined, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${outlined ? 'outlined' : ''}`}
      {...props}
    />
  )
}
