import { useState } from 'react';
import { ArrowLeft, Diamond, Lock, Check, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EQUIPMENT_ITEMS, EquipmentItem } from '../data/equipment-items';

interface DiamondShopProps {
    diamonds: number;
    ownedItems: string[];
    onBuyItem: (itemId: string) => void;
    onBack: () => void;
    backgroundStyle?: string;
}

export function DiamondShop({ diamonds, ownedItems, onBuyItem, onBack, backgroundStyle }: DiamondShopProps) {
    const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

    const canAfford = (item: EquipmentItem) => diamonds >= item.cost;
    const isOwned = (item: EquipmentItem) => ownedItems.includes(item.id);

    const handleBuy = (item: EquipmentItem) => {
        if (canAfford(item) && !isOwned(item)) {
            onBuyItem(item.id);
        }
    };

    return (
        <div className="size-full flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: backgroundStyle ?? 'radial-gradient(circle_at_50%_50%, rgba(17,24,39,1), rgba(2,6,23,1))',
                }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/15 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.08, 0.12, 0.08] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[100px]"
            />

            <div className="relative z-10 w-full max-w-5xl flex flex-col max-h-screen">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between pb-6 flex-shrink-0 border-b border-slate-700/50"
                >
                    <div className="flex items-center gap-4">
                        <ShoppingBag className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Equipment Shop</h2>
                            <p className="text-slate-500 text-xs tracking-widest uppercase mt-1">Permanent upgrades for your journey</p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ boxShadow: ["0 0 10px rgba(6,182,212,0.2)", "0 0 20px rgba(6,182,212,0.4)", "0 0 10px rgba(6,182,212,0.2)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 bg-slate-800/80 border border-cyan-500/30 rounded-xl px-5 py-3"
                    >
                        <Diamond className="w-5 h-5 text-cyan-400" />
                        <span className="text-xl font-black text-cyan-300">{diamonds}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Diamonds</span>
                    </motion.div>
                </motion.div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-slate-900/30">
                    <div className="px-6 py-0 pb-6 space-y-8">
                {/* Items Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
                >
                    {EQUIPMENT_ITEMS.map((item, index) => {
                        const owned = isOwned(item);
                        const affordable = canAfford(item);

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                whileHover={!owned ? { scale: 1.02, y: -2 } : {}}
                                onClick={() => setSelectedItem(item)}
                                className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${owned
                                    ? 'bg-green-900/20 border-green-500/30'
                                    : selectedItem?.id === item.id
                                        ? 'bg-cyan-900/30 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                        : affordable
                                            ? 'bg-slate-800/60 border-slate-600/40 hover:border-cyan-500/40'
                                            : 'bg-slate-900/60 border-slate-700/30 opacity-60'
                                    }`}
                            >
                                {owned && (
                                    <div className="absolute top-3 right-3">
                                        <div className="bg-green-500/20 border border-green-500/40 rounded-full p-1">
                                            <Check className="w-4 h-4 text-green-400" />
                                        </div>
                                    </div>
                                )}
                                {!owned && !affordable && (
                                    <div className="absolute top-3 right-3">
                                        <Lock className="w-4 h-4 text-slate-600" />
                                    </div>
                                )}

                                <div className="text-3xl mb-3">{item.icon}</div>
                                <h3 className={`font-bold text-sm mb-1 ${owned ? 'text-green-300' : 'text-white'}`}>{item.name}</h3>
                                <p className="text-[10px] text-slate-400 mb-2">{item.description}</p>
                                <p className="text-[10px] text-purple-300/80 italic mb-3">{item.passiveDescription}</p>

                                <div className="flex items-center gap-1.5">
                                    <Diamond className={`w-3.5 h-3.5 ${owned ? 'text-green-400' : affordable ? 'text-cyan-400' : 'text-slate-600'}`} />
                                    <span className={`text-sm font-bold ${owned ? 'text-green-400 line-through' : affordable ? 'text-cyan-300' : 'text-slate-600'}`}>
                                        {item.cost}
                                    </span>
                                    {owned && <span className="text-[10px] text-green-400 uppercase tracking-wider ml-1">Owned</span>}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Selected Item Detail / Buy Button */}
                <AnimatePresence mode="wait">
                    {selectedItem && !isOwned(selectedItem) && (
                        <motion.div
                            key={selectedItem.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            className="bg-slate-800/60 border border-slate-600/40 rounded-2xl p-5 mb-6 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{selectedItem.icon}</span>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{selectedItem.name}</h3>
                                    <p className="text-slate-400 text-xs">{selectedItem.description}</p>
                                    <p className="text-purple-300 text-xs italic mt-1">{selectedItem.passiveDescription}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={canAfford(selectedItem) ? { scale: 1.05 } : {}}
                                whileTap={canAfford(selectedItem) ? { scale: 0.95 } : {}}
                                onClick={() => handleBuy(selectedItem)}
                                disabled={!canAfford(selectedItem)}
                                className={`px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition-all ${canAfford(selectedItem)
                                    ? 'bg-cyan-600/30 border border-cyan-500 text-cyan-100 hover:bg-cyan-600/50 shadow-lg shadow-cyan-500/20'
                                    : 'bg-slate-700/30 border border-slate-600 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                <Diamond className="w-4 h-4" />
                                Buy for {selectedItem.cost}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
                    </div>
                </div>

                {/* Footer Actions */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex justify-between items-center px-6 py-6 border-t border-slate-700/50 flex-shrink-0"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-md flex items-center gap-3"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold tracking-widest uppercase">Back to Menu</span>
                    </motion.button>

                    <p className="text-slate-600 text-[10px] tracking-widest uppercase">
                        {ownedItems.length} / {EQUIPMENT_ITEMS.length} Items Owned
                    </p>
                </motion.div>
            </div>
        </div>
    );
}


