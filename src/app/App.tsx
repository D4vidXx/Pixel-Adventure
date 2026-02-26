import { useState, useEffect, useRef } from 'react';
import mainMenuSong1 from '../assets/audio/Main-menu-song1.mp3';
import mainMenuSong2 from '../assets/audio/Main-menu-song2.mp3';
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
import { BASE_STYLE_IDS, GACHA_STYLE_ID, FAIRY_GACHA_STYLE_ID } from './data/styles';
import { Difficulty } from './data/difficulty';

export default function App() {
  // Music audio ref
  const menuMusicRef = useRef<HTMLAudioElement>(null);
  const [currentMenuSong, setCurrentMenuSong] = useState<0 | 1>(0);
  const defaultStyleId = 'pirate';
  const [gameState, setGameState] = useState<'menu' | 'heroSelection' | 'playing' | 'settings' | 'diamondShop' | 'backgroundShop' | 'styleGacha'>('menu');
  const [currentGachaStyleId, setCurrentGachaStyleId] = useState<string>('anime-prism');
  const [currentGachaType, setCurrentGachaType] = useState<'main' | 'fairy'>('main');
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

  const [audioVolume, setAudioVolume] = useState(0.4);

  // Music playback control
  // Handle menu music playback and switching
  useEffect(() => {
    const audio = menuMusicRef.current;
    if (!audio) return;
    if (["menu", "heroSelection", "backgroundShop", "diamondShop", "styleGacha", "settings"].includes(gameState)) {
      audio.volume = audioVolume;
      audio.autoplay = true;
      audio.loop = false;
      // Only reset currentTime if the song itself changes
      // (i.e., when currentMenuSong changes, not just gameState)
      // So do NOT reset currentTime here on gameState change
      // Unmute after user interaction for autoplay policy
      const unmute = () => {
        audio.muted = false;
        window.removeEventListener('pointerdown', unmute);
      };
      window.addEventListener('pointerdown', unmute);
      audio.play().catch(() => { });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [gameState, audioVolume]);

  // When a song ends, switch to the next (loop both)
  useEffect(() => {
    const audio = menuMusicRef.current;
    if (!audio) return;
    const handleEnded = () => {
      setCurrentMenuSong((prev) => (prev === 0 ? 1 : 0));
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handler to skip the current song
  const handleSkipSong = () => {
    setCurrentMenuSong((prev) => (prev === 0 ? 1 : 0));
  };

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

  const handleOpenStyleGacha = (styleId: string, gachaType: 'main' | 'fairy' = 'main') => {
    setCurrentGachaStyleId(styleId);
    setCurrentGachaType(gachaType);
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
    <div className="w-full h-[100dvh] relative overflow-hidden" style={{ background: activeBackground.style }}>
      {/* Global Menu Music (persists across all menus except battle) */}
      <audio
        ref={menuMusicRef}
        src={currentMenuSong === 0 ? mainMenuSong1 : mainMenuSong2}
        muted
        style={{ display: 'none' }}
      />
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
          gachaType={currentGachaType}
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
        <SettingsPage
          audioVolume={audioVolume}
          setAudioVolume={setAudioVolume}
          onSkipSong={handleSkipSong}
          onBack={handleBackToMenu}
        />
      )}
    </div>
  );
}

function SettingsPage({
  audioVolume,
  setAudioVolume,
  onSkipSong,
  onBack
}: {
  audioVolume: number;
  setAudioVolume: (v: number) => void;
  onSkipSong: () => void;
  onBack: () => void;
}) {
  return (
    <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-purple-900 animate-fade-in">
      <div className="bg-slate-900/90 p-10 rounded-2xl shadow-2xl w-full max-w-lg text-white border border-blue-700/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/10 rounded-full blur-2xl z-0" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-blue-500/10 rounded-full blur-2xl z-0" />
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight drop-shadow-lg z-10 relative">Settings</h2>
        <div className="mb-8 z-10 relative">
          <label className="block mb-3 font-semibold text-blue-300">Music Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={audioVolume}
            onChange={e => setAudioVolume(Number(e.target.value))}
            className="w-full accent-blue-400 h-2 rounded-lg appearance-none bg-blue-900/40 shadow-inner"
          />
          <div className="text-right text-xs mt-1 text-blue-200 font-mono">{Math.round(audioVolume * 100)}%</div>
        </div>
        <div className="mb-8 z-10 relative">
          <button
            onClick={onSkipSong}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-500 hover:to-purple-500 rounded-lg shadow-lg font-semibold tracking-wide transition-all duration-200 w-full border border-blue-400/30"
          >
            ⏭️ Skip Current Song
          </button>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-lg shadow transition-colors w-full font-semibold z-10 relative"
        >
          ← Back to Menu
        </button>
      </div>
    </div>
  );
}
