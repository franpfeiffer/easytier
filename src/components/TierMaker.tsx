// same thing here :P
import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { languages } from '../languages/languages';
import { TierMakerProps } from '../interfaces/TierMakerProps';

const TierMaker: React.FC<{ src: string }> = ({ src }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <img src={src} alt="Current image" className="max-w-[80%] max-h-[80%] object-contain" />
    </div>
);

export default function TierList({ language, onBack }: TierMakerProps) {
    const [images, setImages] = useState<string[]>([]);
    const [tiers, setTiers] = useState<string[]>([]);
    const [currentImage, setCurrentImage] = useState<number>(0);

    const [placements, setPlacements] = useState<{[key: string]: number}>({});
    const [setup, setSetup] = useState(true);
    const [tierInput, setTierInput] = useState('');
    const [placedImages] = useState(new Set<string>());

    const [showCurrentImage, setShowCurrentImage] = useState(false);
    const [currentSelection, setCurrentSelection] = useState<number | null>(null);
    const [tempSelection, setTempSelection] = useState<number | null>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const getNextUnplacedImage = (currentIdx: number): number => {
        let nextIdx = currentIdx;
        let loopCount = 0;

        while (loopCount < images.length) {
            nextIdx = (nextIdx + 1) % images.length;
            if (!placedImages.has(images[nextIdx])) {
                return nextIdx;
            }
            loopCount++;
        }
        return -1;
    };

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (!setup && currentImage >= 0 && !placedImages.has(images[currentImage])) {
            if (event.code === 'Space') {
                event.preventDefault();
                const nextIdx = getNextUnplacedImage(currentImage);
                setCurrentImage(nextIdx);
                setShowCurrentImage(true);
                setCurrentSelection(null);
                setTempSelection(null);
            } else if (event.key >= '1' && event.key <= '9') {
                const tierIndex = parseInt(event.key) - 1;
                if (tierIndex < tiers.length) {
                    setTempSelection(tierIndex);
                    setShowCurrentImage(false);
                }
            } else if (event.key === 'Enter' && tempSelection !== null) {
                setPlacements(prev => ({
                    ...prev,
                    [images[currentImage]]: tempSelection
                }));
                placedImages.add(images[currentImage]);
                setCurrentSelection(tempSelection);
                const nextIdx = getNextUnplacedImage(currentImage);
                setCurrentImage(nextIdx);
                setShowCurrentImage(true);
                setTempSelection(null);
            }
        }
    }, [setup, images, currentImage, tiers.length, placedImages, tempSelection]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const exportImage = async () => {
        const element = document.getElementById('tierlist');
        if (element) {
            const canvas = await html2canvas(element);
            const link = document.createElement('a');
            link.download = 'tierlist.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };
    const addTier = () => {
        if (tierInput.trim() && tiers.length < 10) {
            setTiers(prev => [...prev, tierInput.trim()]);
            setTierInput('');
        }
    };
    const getInstructionText = () => {
        if (!showCurrentImage) return languages[language].pressSpace;
        if (tempSelection === null) return languages[language].useNumbers;
        return languages[language].pressEnter;
    };
    return (
        <div className="min-h-screen bg-gray-800 text-white p-8">
        <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-white/80 hover:text-white bg-transparent border-none cursor-pointer"
        >
        <ArrowLeft className="w-5 h-5" />
        {languages[language].back}
        </button>
        {setup ? (
            <div className="max-w-2xl mx-auto space-y-8 p-6 bg-gray-700 rounded-lg shadow-lg">
            <div className="space-y-4">
            <label className="block">
            <span className="sr-only">{languages[language].addImages}</span>
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 cursor-pointer">
            <div className="space-y-2 text-center">

            <Upload className="mx-auto w-8 h-8 text-gray-400" />
            <span className="text-gray-400">{languages[language].addImages}</span>

            </div>
            <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            />
            </div>
            </label>
            {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                {images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded" />

                ))}
                </div>
            )}
            </div>

            <div className="space-y-4">
            <div className="flex gap-2">
            <input
            type="text"
            value={tierInput}
            onChange={(e) => setTierInput(e.target.value)}
            placeholder={languages[language].tierPlaceholder}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && addTier()}
            />

            <button
            onClick={addTier}
            disabled={tiers.length >= 10}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {languages[language].addTier}
            </button>
            </div>
            {tiers.length > 0 && (
                <div className="flex flex-col gap-2">
                {tiers.map((tier, i) => (
                    <div key={i} className="px-4 py-2 bg-gray-600 rounded-lg">
                    {tier}
                    </div>
                ))}
                </div>
            )}
            </div>
            {images.length > 0 && tiers.length > 0 && (
                <button
                onClick={() => {
                    setSetup(false);
                    setCurrentImage(0);
                    setShowCurrentImage(true);
                }}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                {languages[language].done}
                </button>
            )}
            </div>
        ) : (
        <div id="tierlist" className="space-y-8">
        {tiers.map((tier, i) => (
            <div 
            key={i} 
            className={`flex items-center gap-4 ${
                tempSelection === i ? 'ring-2 ring-blue-500' : ''
            }`}
            >
            <div className="w-24 h-24 flex items-center justify-center bg-gray-700 rounded-lg">
            {tier}
            </div>
            <div className="flex-1 min-h-[6rem] bg-gray-700 rounded-lg p-4 flex flex-wrap gap-2">
            {Object.entries(placements)
                .filter(([_, tierIndex]) => tierIndex === i)

                .map(([img]) => (
                    <img key={img} src={img} alt="" className="w-16 h-16 object-cover rounded" />
                ))}
                {tempSelection === i && currentImage >= 0 && !placedImages.has(images[currentImage]) && (
                    <img 
                    src={images[currentImage]} 
                    alt="" 
                    className="w-16 h-16 object-cover rounded opacity-50"
                    />
                )}
                </div>
                </div>
        ))}
        <div className="fixed bottom-8 right-8 flex items-center gap-4">
        {currentImage >= 0 && !placedImages.has(images[currentImage]) && (
            <p className="text-xl font-semibold text-white">
            {getInstructionText()}
            </p>
        )}
        <button
        onClick={exportImage}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
        >
        <Download className="w-5 h-5" />
        {languages[language].export}
        </button>
        </div>
        </div>
        )}
        {!setup && showCurrentImage && images[currentImage] && (
            <TierMaker src={images[currentImage]} />
        )}
        </div>
    );
}
