'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // useSearchParams import edin
import '../globals.css';

const GamePage: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || 'Player'; // URL'den kullanıcı adını al

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Oyun süresi 20 saniye
  const [gameStarted, setGameStarted] = useState(false);
  const [firstTargetClicked, setFirstTargetClicked] = useState(false);

  const boxSize = 500; // Kutunun genişliği ve yüksekliği
  const targetSize = 20; // Zor modda hedef boyutu

  // Rastgele pozisyon oluşturma işlevi (kutunun içinde)
  const generateRandomPosition = (): { x: number; y: number } => {
    const x = Math.floor(Math.random() * (boxSize - targetSize));
    const y = Math.floor(Math.random() * (boxSize - targetSize));
    return { x, y };
  };

  // Hedefe tıklama işlevi
  const handleTargetClick = () => {
    if (!firstTargetClicked) {
      setGameStarted(true);
      setFirstTargetClicked(true);
      setTimeLeft(20); // Oyun süresini yeniden başlat
    } else {
      setScore(score + 1);
      setPosition(generateRandomPosition());
      setTimeLeft(20); // Tıklama sonrası süreyi yeniden başlat
    }
  };

  // Zamanlayıcıyı ayarlamak için useEffect kullanma (oyun başladığında)
  useEffect(() => {
    if (!gameStarted) return;

    const gameTimer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(gameTimer);
    }

    return () => clearInterval(gameTimer);
  }, [gameStarted, timeLeft]);

  // İlk hedef pozisyonunu oluştur
  useEffect(() => {
    if (!firstTargetClicked) {
      setPosition(generateRandomPosition());
    }
  }, [firstTargetClicked]);

  // Zor modda hedefin yer değiştirme süresi
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const interval = setInterval(() => {
        setPosition(generateRandomPosition());
      }, 1000); // Hard mod için her 1 saniyede bir hedef pozisyonu değişir

      return () => clearInterval(interval);
    }
  }, [gameStarted, timeLeft]);

  return (
    <div 
      className="game-cursor"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#282c34',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
        <h1 style={{ marginBottom: '10px' }}>Score: {score}</h1>
        <h2>Time Left: {timeLeft}</h2>
        <h2>Player: {username}</h2> {/* Kullanıcı adını göster */}
      </div>

      <div 
        style={{
          position: 'relative',
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          border: '2px solid white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {gameStarted && timeLeft > 0 && (
          <div
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              width: `${targetSize}px`,
              height: `${targetSize}px`,
              backgroundColor: 'red',
              borderRadius: '50%',
              cursor: 'pointer'
            }}
            onClick={handleTargetClick}
          />
        )}

        {!firstTargetClicked && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'blue',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              onClick={handleTargetClick}
            />
            <span
              style={{
                marginTop: '10px',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer'
              }}
              onClick={handleTargetClick}
            >
              Start
            </span>
          </div>
        )}

        {timeLeft === 0 && gameStarted && (
          <div style={{ color: 'white', fontSize: '24px' }}>
            <h1>Game Over! Final Score: {score}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
