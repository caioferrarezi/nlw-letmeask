import { useState, useEffect } from 'react';

import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [copiedTimeout, setCopiedTimeout] = useState<ReturnType<typeof setTimeout>>();

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);

    setIsCopied(true);

    if (copiedTimeout) {
      clearTimeout(copiedTimeout);
    }

    setCopiedTimeout(setTimeout(() => setIsCopied(false), 1000));
  }

  useEffect(() => {
    return () => {
      if (copiedTimeout) {
        clearTimeout(copiedTimeout);
      }
    }
  }, [copiedTimeout])

  return (
    <button
      className="room-code"
      onClick={copyRoomCodeToClipboard}
    >
      <div>
        <img src={copyImg} alt="Copiar código da sala" />
      </div>

      <span>
        { isCopied ? 'Copiado!' : `Código #${props.code}` }
      </span>
    </button>
  )
}
