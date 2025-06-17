import React from 'react';
import { motion } from 'framer-motion';

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

const AnimalCharacter: React.FC<AnimalCharacterProps> = ({
  currentStage,
  isListening,
  isSpeaking,
  happiness
}) => {
  const getAnimationProps = () => {
    if (isSpeaking) {
      return {
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 0.5 }
      };
    }
    if (isListening) {
      return {
        rotate: [-5, 5, -5],
        transition: { repeat: Infinity, duration: 1 }
      };
    }
    return {
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const }
    };
  };

  const getBackgroundColor = () => {
    if (happiness > 80) return '#FFE4E1'; // 薄いピンク
    if (happiness > 60) return '#E0F6FF'; // 薄い青
    if (happiness > 40) return '#F0FFF0'; // 薄い緑
    if (happiness > 20) return '#FFF8DC'; // 薄い黄色
    return '#F5F5F5'; // グレー
  };

  return (
    <div className="character-container">
      <motion.div
        className="character-background"
        style={{
          background: `radial-gradient(circle, ${getBackgroundColor()}, transparent)`,
          borderRadius: '50%',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
        animate={getAnimationProps()}
      >
        {/* メインキャラクター */}
        <motion.div
          style={{
            fontSize: '80px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStage.emoji}
        </motion.div>

        {/* 感情表現の効果 */}
        {happiness > 70 && (
          <motion.div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '20px'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ✨
          </motion.div>
        )}

        {/* リスニング中の視覚効果 */}
        {isListening && (
          <motion.div
            style={{
              position: 'absolute',
              top: '-10px',
              fontSize: '16px'
            }}
            animate={{
              y: [-5, -15, -5],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            👂
          </motion.div>
        )}

        {/* スピーキング中の視覚効果 */}
        {isSpeaking && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '-10px',
              fontSize: '16px'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 0.4 }}
          >
            💬
          </motion.div>
        )}
      </motion.div>

      {/* キャラクター情報 */}
      <motion.div
        className="character-info"
        style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
            <motion.div
              style={{
                height: '100%',
                backgroundColor: happiness > 70 ? '#4CAF50' : happiness > 40 ? '#FFC107' : '#FF5722',
                borderRadius: '4px'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${happiness}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimalCharacter;