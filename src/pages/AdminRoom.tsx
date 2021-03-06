// import { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { Spinner } from '../components/Spinner';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { id: roomId } = useParams<RoomParams>();
  const history = useHistory();

  // const { user } = useAuth();
  const { title, questions, isLoading } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}`)
        .remove()
    }
  }

  async function handleCheckQuestionAsAnswer(questionId: string) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isAnswered: true })
  }

  async function handleHighlightQuestion(questionId: string, isHighlighted: boolean) {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isHighlighted: !isHighlighted })
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/">
            <img src={logoImg} alt="letmeask" />
          </Link>

          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} outlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>

          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && ( // Fragment
                  <>
                    <button onClick={() => handleCheckQuestionAsAnswer(question.id)}>
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>

                    <button onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}>
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}

                <button onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}
