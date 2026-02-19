import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { CombinedHeroSelection } from './components/CombinedHeroSelection';
import { DiamondShop } from './components/DiamondShop';
import { BackgroundShop } from './components/BackgroundShop';
import { StyleGacha } from './components/StyleGacha';
import { AuroraShootingStar } from './components/AuroraShootingStar';
import { Game } from './components/Game';
import { ParticleBackground } from './components/ParticleBackground';
import { Hero } from './data/heroes';
import { EQUIPMENT_ITEMS } from './data/equipment-items';
import { BACKGROUND_OPTIONS, DEFAULT_BACKGROUND_ID, getBackgroundById } from './data/backgrounds';
import { BASE_STYLE_IDS, GACHA_STYLE_ID } from './data/styles';
import { Difficulty } from './data/difficulty';

export default function App() {
  const defaultStyleId = 'pirate';
  const [gameState, setGameState] = useState<'menu' | 'heroSelection' | 'playing' | 'settings' | 'diamondShop' | 'backgroundShop' | 'styleGacha'>('menu');
  const [currentGachaStyleId, setCurrentGachaStyleId] = useState<string>('anime-prism');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [equippedItems, setEquippedItems] = useState<string[]>([]);

  // Persistent state from localStorage
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('pixelAdventure_diamonds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [ownedItems, setOwnedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('pixelAdventure_ownedItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pixelAdventure_ownedBackgrounds');
    return saved ? JSON.parse(saved) : [DEFAULT_BACKGROUND_ID];
  });

  const [ownedStyles, setOwnedStyles] = useState<string[]>(() => {
    const saved = localStorage.getItem('pixelAdventure_ownedStyles');
    return saved ? JSON.parse(saved) : [...BASE_STYLE_IDS];
  });

  const [activeBackgroundId, setActiveBackgroundId] = useState<string>(() => {
    return localStorage.getItem('pixelAdventure_activeBackground') ?? DEFAULT_BACKGROUND_ID;
  });

  const [activeStyleId, setActiveStyleId] = useState<string>(() => {
    return localStorage.getItem('pixelAdventure_activeStyle') ?? defaultStyleId;
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('pixelAdventure_difficulty');
    return (saved as Difficulty) || 'normal';
  });

  // Save to localStorage whenever diamonds or ownedItems change
  useEffect(() => {
    localStorage.setItem('pixelAdventure_diamonds', diamonds.toString());
  }, [diamonds]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_ownedItems', JSON.stringify(ownedItems));
  }, [ownedItems]);

  useEffect(() => {
    if (!ownedBackgrounds.includes(DEFAULT_BACKGROUND_ID)) {
      setOwnedBackgrounds((prev) => [...prev, DEFAULT_BACKGROUND_ID]);
    }
  }, [ownedBackgrounds]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_ownedBackgrounds', JSON.stringify(ownedBackgrounds));
  }, [ownedBackgrounds]);

  useEffect(() => {
    const missing = BASE_STYLE_IDS.filter((styleId) => !ownedStyles.includes(styleId));
    if (missing.length > 0) {
      setOwnedStyles((prev) => [...prev, ...missing]);
    }
  }, [ownedStyles]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_ownedStyles', JSON.stringify(ownedStyles));
  }, [ownedStyles]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_activeBackground', activeBackgroundId);
  }, [activeBackgroundId]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_activeStyle', activeStyleId);
  }, [activeStyleId]);

  useEffect(() => {
    localStorage.setItem('pixelAdventure_difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (!ownedStyles.includes(activeStyleId)) {
      setActiveStyleId(defaultStyleId);
    }
  }, [activeStyleId, ownedStyles, defaultStyleId]);

  // Secret cheat code listener: typing "devmode" unlocks all items + 9999 diamonds
  useEffect(() => {
    let buffer = '';
    const handleKeydown = (e: KeyboardEvent) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 7) buffer = buffer.slice(-7);
      if (buffer === 'devmode') {
        const allItemIds = EQUIPMENT_ITEMS.map(i => i.id);
        setOwnedItems(allItemIds);
        setDiamonds(9999);
        buffer = '';
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handlePlay = () => {
    setEquippedItems([]);
    setGameState('heroSelection');
  };

  const handleHeroSelect = (hero: Hero) => {
    setSelectedHero(hero);
    setGameState('playing');
  };

  const handleSettings = () => {
    setGameState('settings');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedHero(null);
    setEquippedItems([]);
  };

  const handleOpenShop = () => {
    setGameState('diamondShop');
  };

  const handleOpenBackgroundShop = () => {
    setGameState('backgroundShop');
  };

  const handleOpenStyleGacha = (styleId: string) => {
    setCurrentGachaStyleId(styleId);
    setGameState('styleGacha');
  };

  const handleBuyItem = (itemId: string) => {
    const item = EQUIPMENT_ITEMS.find(i => i.id === itemId);
    if (item && diamonds >= item.cost && !ownedItems.includes(itemId)) {
      setDiamonds(prev => prev - item.cost);
      setOwnedItems(prev => [...prev, itemId]);
    }
  };

  const handleBuyBackground = (backgroundId: string, cost: number) => {
    if (diamonds < cost || ownedBackgrounds.includes(backgroundId)) return;
    setDiamonds((prev) => prev - cost);
    setOwnedBackgrounds((prev) => [...prev, backgroundId]);
    setActiveBackgroundId(backgroundId);
  };

  const handleSelectBackground = (backgroundId: string) => {
    if (!ownedBackgrounds.includes(backgroundId)) return;
    setActiveBackgroundId(backgroundId);
  };

  const handleSelectStyle = (styleId: string) => {
    if (!ownedStyles.includes(styleId)) return;
    setActiveStyleId(styleId);
  };

  const handleUnlockStyle = (styleId: string) => {
    if (ownedStyles.includes(styleId)) return;
    setOwnedStyles((prev) => [...prev, styleId]);
    if (styleId === GACHA_STYLE_ID) {
      setActiveStyleId(styleId);
    }
  };

  const handleDiamondsEarned = (amount: number) => {
    setDiamonds(prev => prev + amount);
  };

  const handleSpendDiamonds = (amount: number) => {
    setDiamonds((prev) => Math.max(prev - amount, 0));
  };

  const handleToggleEquip = (itemId: string) => {
    setEquippedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      if (prev.length >= 2) return prev; // Max 2 equipped
      return [...prev, itemId];
    });
  };

  const activeBackground = getBackgroundById(activeBackgroundId) ?? BACKGROUND_OPTIONS[0];
  const showGlobalBackgroundEffects = gameState !== 'playing';

  const handleClaimGift = (styleId: string) => {
    if (!ownedStyles.includes(styleId)) {
      const newOwnedStyles = [...ownedStyles, styleId];
      setOwnedStyles(newOwnedStyles);
      setActiveStyleId(styleId);
      localStorage.setItem('pixelAdventure_ownedStyles', JSON.stringify(newOwnedStyles));
      localStorage.setItem('pixelAdventure_activeStyle', styleId);
    }
  };

  return (
    <div className="size-full relative" style={{ background: activeBackground.style }}>
      {showGlobalBackgroundEffects && activeBackgroundId === 'aurora-borealis' && <AuroraShootingStar />}
      <ParticleBackground />
      {gameState === 'menu' && (
        <MainMenu
          onPlay={handlePlay}
          onSettings={handleSettings}
          onShop={handleOpenShop}
          onBackgroundShop={handleOpenBackgroundShop}
          onStyleGacha={handleOpenStyleGacha}
          onClaimGift={handleClaimGift}
          diamonds={diamonds}
          backgroundStyle={activeBackground.style}
          activeStyleId={activeStyleId}
          activeBackgroundId={activeBackgroundId}
          ownedStyles={ownedStyles}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      )}
      {gameState === 'diamondShop' && (
        <DiamondShop
          diamonds={diamonds}
          ownedItems={ownedItems}
          onBuyItem={handleBuyItem}
          onBack={handleBackToMenu}
          backgroundStyle={activeBackground.style}
        />
      )}
      {gameState === 'backgroundShop' && (
        <BackgroundShop
          diamonds={diamonds}
          ownedBackgrounds={ownedBackgrounds}
          activeBackgroundId={activeBackgroundId}
          onBuyBackground={handleBuyBackground}
          onSelectBackground={handleSelectBackground}
          ownedStyles={ownedStyles}
          activeStyleId={activeStyleId}
          onSelectStyle={handleSelectStyle}
          onBack={handleBackToMenu}
          backgroundStyle={activeBackground.style}
        />
      )}
      {gameState === 'styleGacha' && (
        <StyleGacha
          diamonds={diamonds}
          ownedStyles={ownedStyles}
          activeStyleId={activeStyleId}
          onUnlockStyle={handleUnlockStyle}
          onSelectStyle={handleSelectStyle}
          onSpendDiamonds={handleSpendDiamonds}
          onBack={handleBackToMenu}
          backgroundStyle={activeBackground.style}
          styleId={currentGachaStyleId}
        />
      )}
      {gameState === 'heroSelection' && (
        <CombinedHeroSelection
          onSelectHero={handleHeroSelect}
          onBack={handleBackToMenu}
          ownedItems={ownedItems}
          equippedItems={equippedItems}
          onToggleEquip={handleToggleEquip}
          backgroundStyle={activeBackground.style}
          activeBackgroundId={activeBackgroundId}
          activeStyleId={activeStyleId}
        />
      )}
      {gameState === 'playing' && selectedHero && (
        <Game
          hero={selectedHero}
          onBackToMenu={handleBackToMenu}
          equippedItems={equippedItems}
          ownedItems={ownedItems}
          onDiamondsEarned={handleDiamondsEarned}
          activeStyleId={activeStyleId}
          activeBackgroundId={activeBackgroundId}
          difficulty={difficulty}
        />
      )}
      {gameState === 'settings' && (
        <div className="size-full flex items-center justify-center">
          <div className="text-white">
            <p className="mb-4">Settings coming soon...</p>
            <button
              onClick={handleBackToMenu}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
