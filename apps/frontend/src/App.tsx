import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the Socket.IO server

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  width: 200px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ScoreList = styled.div`
  margin-top: 20px;
  width: 300px;
  text-align: left;
`;

const ScoreItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

function App() {
  const [userId, setUserId] = useState('');
  const [quizId, setQuizId] = useState('');
  const [scores, setScores] = useState({});

  // Event listeners for socket
  useEffect(() => {
    socket.on('initial-scores', (initialScores) => {
      setScores(initialScores);
    });

    socket.on('score-update', ({ userId, score }) => {
      setScores((prevScores) => ({ ...prevScores, [userId]: score }));
    });

    // Cleanup on unmount
    return () => {
      socket.off('initial-scores');
      socket.off('score-update');
    };
  }, []);

  // Join quiz room handler
  const joinQuiz = () => {
    if (quizId && userId) {
      socket.emit('join-quiz', { quizId, userId });
    }
  };

  return (
    <Container>
      <Title>Real-time Quiz</Title>
      <Input type="text" placeholder="Enter User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <Input type="text" placeholder="Enter Quiz ID" value={quizId} onChange={(e) => setQuizId(e.target.value)} />
      <Button onClick={joinQuiz}>Join Quiz</Button>

      {userId && (
        <ScoreList>
          <h3>Scores</h3>
          <ScoreItem>
            {userId}: {scores[userId] ?? 0}
          </ScoreItem>
        </ScoreList>
      )}
    </Container>
  );
}

export default App;
