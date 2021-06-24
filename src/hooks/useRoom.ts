import { useEffect, useState } from "react";

import { useAuth } from "./useAuth";
import { database } from "../services/firebase";

type QuestionRecord = {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likesCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, QuestionRecord>;

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likesCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([, like]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      setIsLoading(false);
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { title, questions, isLoading }
}
