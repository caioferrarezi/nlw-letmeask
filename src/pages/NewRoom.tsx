import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';
import { generateId } from '../tools/generate-id';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }

    let roomId = generateId(16);
    let roomRef = await database.ref(`rooms/${roomId}`).get();

    while(roomRef.exists()) {
      roomId = generateId(16);
      roomRef = await database.ref(`rooms/${roomId}`).get();
    }

    await database
      .ref(`rooms/${roomId}`)
      .set({ title: newRoom, authorId: user?.id })

    history.push(`/salas/${roomId}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />

        <strong>Crie salas de Q&amp;A ao vivo!</strong>
        <p>Tire as dúvidas da sua audiência em tempo real.</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="letmeask" />

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              value={newRoom}
              onChange={event => setNewRoom(event.target.value)}
            />

            <Button type="submit">
              Criar sala
            </Button>
          </form>

          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
