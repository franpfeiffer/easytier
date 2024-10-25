// the indenting is like this because I use neovim and with = it autoindents,
// i'm to lazy to indent it correctly :(

import React, { useState } from 'react';
import { Flag, Languages, Info, Plus } from 'lucide-react';
import Instructions from './components/Instructions';
import TierMaker from './components/TierMaker';
import { TierMakerProps } from './components/TierMakerProps';
import { languages } from './languages/languages';

function App() {
    const [language, setLanguage] = useState<'en' | 'es'>('en');
    const [showInstructions, setShowInstructions] = useState(false);
    const [showTierMaker, setShowTierMaker] = useState(false);

    return (
        <div className="min-h-screen bg-gray-800">
        <div className="container mx-auto px-4">
        <div className="absolute top-4 right-4">
        <button
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all"
        >
        <Flag className="w-5 h-5" />
        <span className="text-white">{languages[language].language}</span>
        </button>
        </div>
        {!showTierMaker ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-white">
            <h1 className="text-6xl font-bold mb-12 text-white">
            {languages[language].title}
            </h1>
            <div className="flex flex-col gap-4 w-full max-w-md">
            <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-white/20 transition-all text-lg"
            >
            <Info className="w-5 h-5" />
            {languages[language].instructions}
            </button>
            <button
            onClick={() => setShowTierMaker(true)}
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-white/20 transition-all text-lg"
            >
            <Plus className="w-5 h-5" />
            {languages[language].newTierlist}
            </button>
            </div>
            {showInstructions && (
                <Instructions language={language} onClose={() => setShowInstructions(false)} />
            )}
            </div>
        ) : (
        <TierMaker language={language} onBack={() => setShowTierMaker(false)} />
        )}
        </div>
        </div>
    );
}

export default App;
