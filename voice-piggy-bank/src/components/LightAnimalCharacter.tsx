import React from 'react';

export interface AnimalStage {
  name: string;
  emoji: string;
  minSavings: number;
  description: string;
  color: string;
}

interface AnimalCharacterProps {
  currentStage: AnimalStage;
  isListening: boolean;
  isSpeaking: boolean;
  happiness: number;
}

const LightAnimalCharacter: React.FC<AnimalCharacterProps> = ({
  currentStage,
  isListening,
  isSpeaking,
  happiness
}) => {
  const getBackgroundColor = () => {
    if (happiness > 80) return '#FFE4E1';
    if (happiness > 60) return '#E0F6FF';
    if (happiness > 40) return '#F0FFF0';
    if (happiness > 20) return '#FFF8DC';
    return '#F5F5F5';
  };

  const getAnimationClass = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'floating';
  };

  return (
    <div className="character-container">
      <div
        className={`character-background ${getAnimationClass()}`}
        style={{
          background: `radial-gradient(circle, ${getBackgroundColor()}, transparent)`,
          borderRadius: '50%',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          margin: '20px auto'
        }}
      >
        {/* メインキャラクター */}
        <div
          style={{
            fontSize: '80px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          className="character-emoji"
        >
          {currentStage.emoji}
        </div>

        {/* 感情表現の効果 */}
        {happiness > 70 && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '20px'
            }}
            className="sparkle"
          >
            ✨
          </div>
        )}

        {/* リスニング中の視覚効果 */}
        {isListening && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              fontSize: '16px'
            }}
            className="listening-indicator"
          >
            👂
          </div>
        )}

        {/* スピーキング中の視覚効果 */}
        {isSpeaking && (
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              fontSize: '16px'
            }}
            className="speaking-indicator"
          >
            💬
          </div>
        )}
      </div>

      {/* キャラクター情報 */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <h3 style={{ 
          margin: '0 0 10px 0', 
          color: currentStage.color,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          {currentStage.name}
        </h3>
        <p style={{ 
          margin: '0', 
          color: '#666',
          fontSize: '16px'
        }}>
          {currentStage.description}
        </p>

        {/* ハピネスメーター */}
        <div style={{ marginTop: '15px' }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#888', 
            marginBottom: '5px' 
          }}>
            きもち: {happiness}/100
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#E0E0E0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                width: `${happiness}%`,
                backgroundColor: happiness > 70 ? '#4CAF50' : happiness > 40 ? '#FFC107' : '#FF5722',
                borderRadius: '4px',
                transition: 'width 1s ease-out'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightAnimalCharacter;