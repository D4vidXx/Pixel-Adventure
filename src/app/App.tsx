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
import { EventsMenu } from './components/EventsMenu';
import { FightClubNameScreen } from './components/FightClubNameScreen';
import { FightClubIntroScreen } from './components/FightClubIntroScreen';
import { FightClubGame } from './components/FightClubGame';
import { Hero, ALL_HEROES } from './data/heroes';
import { EQUIPMENT_ITEMS } from './data/equipment-items';
import { BACKGROUND_OPTIONS, DEFAULT_BACKGROUND_ID, getBackgroundById } from './data/backgrounds';
import { BASE_STYLE_IDS, GACHA_STYLE_ID, FAIRY_GACHA_STYLE_ID } from './data/styles';
import { Difficulty } from './data/difficulty';
import { useMultiplayer } from './hooks/useMultiplayer';
import { MultiplayerLobby } from './components/MultiplayerLobby';

export default function App() {
  // Music audio ref
  const menuMusicRef = useRef<HTMLAudioElement>(null);
  const [currentMenuSong, setCurrentMenuSong] = useState<0 | 1>(0);
  const defaultStyleId = 'pirate';
  const [gameState, setGameState] = useState<'menu' | 'heroSelection' | 'playing' | 'settings' | 'diamondShop' | 'backgroundShop' | 'styleGacha' | 'events_menu' | 'fightClubName' | 'fightClubIntro' | 'fightClub' | 'multiplayerLobby'>('menu');
  const [gameMode, setGameMode] = useState<'normal' | 'event_goblin_ambush' | 'event_fight_club'>('normal');
  const [fighterName, setFighterName] = useState('');
  const [currentGachaStyleId, setCurrentGachaStyleId] = useState<string>('anime-prism');
  const [currentGachaType, setCurrentGachaType] = useState<'main' | 'fairy'>('main');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  // Multiplayer Room States
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [mpRoomId, setMpRoomId] = useState<string | null>(null);
  const [mpPlayerName, setMpPlayerName] = useState('');
  const [remoteHero, setRemoteHero] = useState<Hero | null>(null);
  const [remoteEquippedItems, setRemoteEquippedItems] = useState<string[]>([]);
  const [remoteReady, setRemoteReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [pendingStart, setPendingStart] = useState(false);

  // Connection management
  const {
    isConnected,
    isConnecting,
    connectionError,
    role,
    players,
    send,
    on,
    disconnect
  } = useMultiplayer(mpRoomId, mpPlayerName);

  // Synchronize co-op events in hero selection
  useEffect(() => {
    if (!isConnected) return;

    const unsubs = [
      on("proceed_to_heroes", () => {
        setGameState("heroSelection");
      }),

      on("select_hero", (data) => {
        console.debug('[MP] select_hero received', data);
        const hero = ALL_HEROES.find(h => h.id === data.heroId) || null;
        setRemoteHero(hero);
        setRemoteEquippedItems(data.equippedItems || []);
      }),

      on("toggle_ready", (data) => {
        console.debug('[MP] toggle_ready received', data);
        setRemoteReady(data.isReady);
      }),

      on("start_game", () => {
        console.debug('[MP] start_game received - selectedHero:', selectedHero?.id || 'null', 'remoteHero:', remoteHero?.id || 'null', 'remoteHero obj:', remoteHero);
        // If either side hasn't selected a hero yet, mark pending and wait for both selections.
        if (isMultiplayer && (!selectedHero || !remoteHero)) {
          console.warn('start_game received but hero(s) missing, deferring start', {selectedHero: !!selectedHero, remoteHero: !!remoteHero});
          setPendingStart(true);
          // stay on heroSelection until both heroes present
          setGameState("heroSelection");
          return;
        }
        console.log('[DEBUG] start_game: Both heroes present, transitioning to playing');
        setPendingStart(false);
        setGameState("playing");
      }),

      on("player_left", () => {
        setRemoteHero(null);
        setRemoteEquippedItems([]);
        setRemoteReady(false);
        setIsReady(false);
      })
    ];

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [isConnected, on, isMultiplayer, selectedHero]);

  // If a start was requested but one or both heroes were missing, start when both are available
  useEffect(() => {
    if (!pendingStart) return;
    if (selectedHero && remoteHero) {
      setPendingStart(false);
      setGameState('playing');
    }
    // Cancel pending start after 8s to avoid indefinite wait
    const t = setTimeout(() => {
      if (pendingStart) {
        console.warn('Pending multiplayer start timed out');
        setPendingStart(false);
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [pendingStart, selectedHero, remoteHero]);

  const [equippedItems, setEquippedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('pixelAdventure_equippedItems');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.filter((id: string) => id !== 'bone_smasher'); // Ensure it's not equipped either
    }
    return [];
  });

  // Persistent state from localStorage
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('pixelAdventure_diamonds');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [ownedItems, setOwnedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('pixelAdventure_ownedItems');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Remove bone_smasher if they got it from the shop glitch earlier
      return parsed.filter((id: string) => id !== 'bone_smasher');
    }
    return [];
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
    localStorage.setItem('pixelAdventure_equippedItems', JSON.stringify(equippedItems));
  }, [equippedItems]);

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
    setIsMultiplayer(false);
    setGameMode('normal');
    setEquippedItems([]);
    setGameState('heroSelection');
  };

  const handleCoop = () => {
    setIsMultiplayer(true);
    setGameMode('normal');
    setEquippedItems([]);
    setGameState('multiplayerLobby');
  };

  const handleMpConnect = (roomId: string, name: string) => {
    setMpPlayerName(name);
    setMpRoomId(roomId);
  };

  const handleMpProceedToHeroes = () => {
    // Host broadcasts to guest to go to hero selection
    send('proceed_to_heroes', {});
    setGameState('heroSelection');
  };

  // Called when local player selects their hero in co-op
  const handleHeroSelectMP = (hero: Hero) => {
    if (!hero || !hero.id) {
      console.error('Invalid hero selection:', hero);
      return;
    }
    setSelectedHero(hero);
    send('select_hero', { heroId: hero.id, equippedItems });
  };

  // Called when local player toggles ready in co-op
  const handleToggleReadyMP = () => {
    try {
      const next = !isReady;
      console.log('[handleToggleReadyMP] Toggling ready from', isReady, 'to', next);
      setIsReady(next);
      console.log('[handleToggleReadyMP] Sending toggle_ready message with:', { isReady: next });
      send('toggle_ready', { isReady: next });
      console.log('[handleToggleReadyMP] Done');
    } catch (error) {
      console.error('[handleToggleReadyMP] Error:', error);
    }
  };

  // Called by the host to start the game when both are ready
  const handleStartGameMP = () => {
    if (role !== 'host') return; // Only host can initiate game start
    send('start_game', {});
    setGameState('playing');
  };

  const handleEvents = () => {
    setGameState('events_menu');
  };

  const handleStartEvent = (eventId: 'event_goblin_ambush' | 'event_fight_club') => {
    if (eventId === 'event_fight_club') {
      setGameMode('event_fight_club');
      setEquippedItems([]);
      setGameState('fightClubName');
      return;
    }
    setGameMode(eventId);
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
    // Clean up multiplayer state
    if (isMultiplayer) {
      disconnect();
      setMpRoomId(null);
      setIsMultiplayer(false);
      setRemoteHero(null);
      setRemoteEquippedItems([]);
      setRemoteReady(false);
      setIsReady(false);
    }
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
          onCoop={handleCoop}
          onEvents={handleEvents}
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
      {gameState === 'multiplayerLobby' && (
        <MultiplayerLobby
          onBack={handleBackToMenu}
          onConnect={handleMpConnect}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connectionError={connectionError}
          roomId={mpRoomId}
          players={players}
          role={role}
          onProceedToHeroSelection={handleMpProceedToHeroes}
          backgroundStyle={activeBackground.style}
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
          onSelectHero={isMultiplayer ? handleHeroSelectMP : handleHeroSelect}
          onBack={handleBackToMenu}
          ownedItems={ownedItems}
          equippedItems={equippedItems}
          onToggleEquip={handleToggleEquip}
          backgroundStyle={activeBackground.style}
          activeBackgroundId={activeBackgroundId}
          activeStyleId={activeStyleId}
          isMultiplayer={isMultiplayer}
          role={role}
          players={players}
          remoteHero={remoteHero}
          remoteEquippedItems={remoteEquippedItems}
          remoteReady={remoteReady}
          isReady={isReady}
          onToggleReady={handleToggleReadyMP}
          onStartGame={handleStartGameMP}
        />
      )}
      {gameState === 'playing' && (selectedHero || (isMultiplayer && remoteHero)) && (
        <Game
          hero={selectedHero || remoteHero}
          onBackToMenu={handleBackToMenu}
          equippedItems={equippedItems}
          ownedItems={ownedItems}
          onEquipmentUnlocked={(id: string) => {
            if (!ownedItems.includes(id)) {
              setOwnedItems(prev => [...prev, id]);
            }
          }}
          onDiamondsEarned={handleDiamondsEarned}
          activeStyleId={activeStyleId}
          activeBackgroundId={activeBackgroundId}
          difficulty={difficulty}
          gameMode={gameMode}
          // Co-op props (passed through for future rendering)
          isMultiplayer={isMultiplayer}
          multiplayerRole={role}
          remoteHero={remoteHero}
          remoteEquippedItems={remoteEquippedItems}
          multiplayerSend={isMultiplayer ? send : undefined}
          multiplayerOn={isMultiplayer ? on : undefined}
        />
      )}
      {gameState === 'events_menu' && (
        <EventsMenu
          onStartEvent={handleStartEvent}
          onBack={handleBackToMenu}
          ownedItems={ownedItems}
          diamonds={diamonds}
        />
      )}
      {gameState === 'fightClubName' && (
        <FightClubNameScreen
          onConfirm={(name) => { setFighterName(name); setGameState('fightClubIntro'); }}
          onBack={() => setGameState('events_menu')}
        />
      )}
      {gameState === 'fightClubIntro' && (
        <FightClubIntroScreen
          fighterName={fighterName}
          onComplete={() => setGameState('fightClub')}
        />
      )}
      {gameState === 'fightClub' && (
        <FightClubGame
          fighterName={fighterName}
          onVictory={() => {
            if (!ownedItems.includes('boxer_glove')) {
              setOwnedItems(prev => [...prev, 'boxer_glove']);
            }
            setGameState('events_menu');
          }}
          onDefeat={() => setGameState('events_menu')}
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
