import { AnimalStage } from '../components/AnimalCharacter';

export const ANIMAL_STAGES: AnimalStage[] = [
  {
    name: "たまご",
    emoji: "🥚",
    minSavings: 0,
    description: "まだ生まれていません",
    color: "#FFA726"
  },
  {
    name: "ひよこ",
    emoji: "🐣",
    minSavings: 100,
    description: "元気いっぱいの赤ちゃん！",
    color: "#FFEB3B"
  },
  {
    name: "こいぬ",
    emoji: "🐶",
    minSavings: 500,
    description: "活発に動き回ります",
    color: "#8BC34A"
  },
  {
    name: "おおかみ",
    emoji: "🐺",
    minSavings: 1000,
    description: "賢くて強くなりました",
    color: "#2196F3"
  },
  {
    name: "ライオン",
    emoji: "🦁",
    minSavings: 2000,
    description: "百獣の王になりました！",
    color: "#FF5722"
  },
  {
    name: "ドラゴン",
    emoji: "🐉",
    minSavings: 5000,
    description: "伝説の存在です！",
    color: "#9C27B0"
  }
];

export const getCurrentStage = (totalSavings: number): AnimalStage => {
  let currentStage = ANIMAL_STAGES[0];
  
  for (const stage of ANIMAL_STAGES) {
    if (totalSavings >= stage.minSavings) {
      currentStage = stage;
    } else {
      break;
    }
  }
  
  return currentStage;
};

export const getNextStage = (currentStage: AnimalStage): AnimalStage | null => {
  const currentIndex = ANIMAL_STAGES.findIndex(stage => stage.name === currentStage.name);
  return currentIndex < ANIMAL_STAGES.length - 1 ? ANIMAL_STAGES[currentIndex + 1] : null;
};

export const getProgressToNextStage = (totalSavings: number, currentStage: AnimalStage): number => {
  const nextStage = getNextStage(currentStage);
  if (!nextStage) return 100; // 最大レベル
  
  const progressInCurrentStage = totalSavings - currentStage.minSavings;
  const totalNeededForNext = nextStage.minSavings - currentStage.minSavings;
  
  return Math.min(100, Math.max(0, (progressInCurrentStage / totalNeededForNext) * 100));
};

export const calculateHappiness = (
  totalSavings: number, 
  recentActivity: number,
  timeSinceLastInteraction: number
): number => {
  let happiness = 50; // ベースハピネス
  
  // 貯金額によるボーナス
  happiness += Math.min(30, totalSavings / 100);
  
  // 最近の活動による影響
  if (recentActivity > 0) {
    happiness += Math.min(20, recentActivity / 50);
  } else if (recentActivity < -100) {
    happiness -= 15;
  }
  
  // 時間経過による影響
  const hoursInactive = timeSinceLastInteraction / (1000 * 60 * 60);
  if (hoursInactive > 24) {
    happiness -= Math.min(20, hoursInactive - 24);
  }
  
  return Math.min(100, Math.max(0, Math.round(happiness)));
};