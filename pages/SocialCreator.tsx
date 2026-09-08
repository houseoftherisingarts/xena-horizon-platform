import React, { useState, useRef, useEffect } from 'react';
import { Download, Image as ImageIcon, Plus, Move, Trash2, Square, Smartphone, Monitor, Sparkles, Upload, X } from 'lucide-react';
import { EnTete, Panneau, Bouton, Vide } from '../components/admin/ui';
import { GalleryImage, Language } from '../types';
import { useCollection } from '../lib/firestore';

interface SocialCreatorProps {
  lang: Language;
}

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  isBold: boolean;
  color: string;
}

interface Format {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: React.ReactNode;
}

const FORMATS: Format[] = [
  { id: 'square', label: 'Carré (1:1)', width: 1080, height: 1080, icon: <Square className="w-4 h-4" /> },
  { id: 'portrait', label: 'Story (9:16)', width: 1080, height: 1920, icon: <Smartphone className="w-4 h-4" /> },
  { id: 'feed', label: 'Feed (4:5)', width: 1080, height: 1350, icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'landscape', label: 'Paysage (16:9)', width: 1920, height: 1080, icon: <Monitor className="w-4 h-4" /> },
];

const TUILE = 'flex flex-col items-center justify-center p-3 rounded-champ border transition-colors text-xs font-medium';
const TUILE_ACTIVE = 'border-rose text-rose bg-rose/10';
const TUILE_INACTIVE = 'border-filet text-gris hover:border-encre hover:text-encre';

const SocialCreator: React.FC<SocialCreatorProps> = ({ lang }) => {
  const { data: gallery } = useCollection<GalleryImage>('gallery');

  // State
  const [selectedFormat, setSelectedFormat] = useState<Format>(FORMATS[0]);
  const [bgImage, setBgImage] = useState('/images/laurie-portrait-nb.jpg');
  const [isGrayscale, setIsGrayscale] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Nano Banana State
  const [isNanoOpen, setIsNanoOpen] = useState(false);
  const [nanoPrompt, setNanoPrompt] = useState('');
  const [nanoRefPreview, setNanoRefPreview] = useState<string | null>(null);
  const nanoFileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    FR: {
      title: 'Créateur de contenu',
      subtitle: 'Générez des visuels de marque pour les réseaux sociaux.',
      format: 'Format',
      layers: 'Calques texte',
      add: 'Ajouter',
      newText: 'Nouveau texte',
      size: 'Taille police',
      bgImg: 'Image de fond',
      bw: 'Noir et blanc',
      random: 'Aléatoire',
      gallery: 'Galerie',
      nano: 'Nano Banana',
      nanoTitle: 'Génération IA (Nano Banana)',
      nanoPlaceholder: "Décrivez l'image de fond idéale...",
      generate: 'Générer',
      soon: 'La génération par IA arrive bientôt : elle passera par le serveur pour protéger la clé.',
      download: "Télécharger l'image",
      hint: 'Glissez les textes avec la souris',
      selectImg: 'Sélectionner une image',
      use: 'Utiliser',
      emptyGallery: "Aucune image. Ajoutez-en depuis la galerie de l'admin.",
      uploadRef: 'Ajouter une image de référence (optionnel)',
      remove: 'Retirer',
    },
    EN: {
      title: 'Content creator',
      subtitle: 'Generate branded visuals for social media.',
      format: 'Format',
      layers: 'Text layers',
      add: 'Add',
      newText: 'New text',
      size: 'Font size',
      bgImg: 'Background image',
      bw: 'Black and white',
      random: 'Random',
      gallery: 'Gallery',
      nano: 'Nano Banana',
      nanoTitle: 'AI generation (Nano Banana)',
      nanoPlaceholder: 'Describe the ideal background image...',
      generate: 'Generate',
      soon: 'AI generation is coming soon: it will go through the server to protect the key.',
      download: 'Download image',
      hint: 'Drag text with mouse',
      selectImg: 'Select image',
      use: 'Use',
      emptyGallery: 'No images yet. Add some from the admin gallery.',
      uploadRef: 'Add reference image (optional)',
      remove: 'Remove',
    },
  }[lang];

  // Text Layers
  const [layers, setLayers] = useState<TextLayer[]>([
    { id: '1', text: 'Votre message inspirant', x: 540, y: 540, fontSize: 60, isBold: true, color: '#ffffff' },
    { id: '2', text: '@xenahorizon', x: 540, y: 900, fontSize: 30, isBold: false, color: '#e2ded4' },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('1');

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOGIC ---

  const addLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: t.newText,
      x: selectedFormat.width / 2,
      y: selectedFormat.height / 2,
      fontSize: 40,
      isBold: false,
      color: '#ffffff',
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const updateLayer = (id: string, updates: Partial<TextLayer>) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  // --- GÉNÉRATION IA ---
  // La génération par IA (Nano Banana / Gemini) demande une clé qui ne peut pas vivre dans le
  // navigateur : elle passera par une fonction serveur. En attendant, le bouton reste désactivé
  // (voir la modale plus bas) et aucune clé n'est exposée côté client.

  const handleNanoImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNanoRefPreview(URL.createObjectURL(file));
    }
  };

  // --- DRAWING ---

  const generateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Image
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = bgImage;

    img.onload = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw BG
      ctx.save();
      if (isGrayscale) {
        ctx.filter = 'grayscale(100%) brightness(60%)'; // Darker for text readability
      } else {
        ctx.filter = 'brightness(70%)';
      }

      // Calculate "Cover" fit
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = canvas.width / 2 - (img.width / 2) * scale;
      const y = canvas.height / 2 - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // Draw Layers
      layers.forEach((layer) => {
        ctx.save();
        ctx.font = `${layer.isBold ? 'bold' : 'normal'} ${layer.fontSize}px serif`;
        ctx.fillStyle = layer.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow for readability
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Multiline wrapping logic if text is too long (basic)
        const maxWidth = canvas.width * 0.8;
        const words = layer.text.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);

        const lineHeight = layer.fontSize * 1.2;
        const startY = layer.y - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((l, i) => {
          ctx.fillText(l, layer.x, startY + i * lineHeight);
        });

        // Draw selection box if selected
        if (layer.id === selectedLayerId && !isDragging) {
          ctx.strokeStyle = '#A8104A';
          ctx.lineWidth = 2;
          ctx.shadowColor = 'transparent';
          // This is an approximation for visual feedback
          const totalHeight = lines.length * lineHeight;
          ctx.strokeRect(layer.x - maxWidth / 2, layer.y - totalHeight / 2 - 10, maxWidth, totalHeight + 20);
        }

        ctx.restore();
      });
    };
  };

  useEffect(() => {
    generateCanvas();
  }, [layers, bgImage, isGrayscale, selectedFormat, selectedLayerId]);

  // --- MOUSE HANDLERS ---

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const coords = getCanvasCoordinates(e);

    const clickedLayer = layers.find((layer) => {
      const dx = coords.x - layer.x;
      const dy = coords.y - layer.y;
      return Math.abs(dx) < 300 && Math.abs(dy) < layer.fontSize * 2;
    });

    if (clickedLayer) {
      setSelectedLayerId(clickedLayer.id);
      setIsDragging(true);
      setDragOffset({
        x: coords.x - clickedLayer.x,
        y: coords.y - clickedLayer.y,
      });
    } else {
      setSelectedLayerId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !selectedLayerId) return;

    const coords = getCanvasCoordinates(e);
    updateLayer(selectedLayerId, {
      x: coords.x - dragOffset.x,
      y: coords.y - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Deselect before printing to remove the selection box
      const currentSelection = selectedLayerId;
      setSelectedLayerId(null);

      // Wait for next render frame
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = `xena-${selectedFormat.id}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        setSelectedLayerId(currentSelection); // Restore
      }, 50);
    }
  };

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete titre={t.title} lede={t.subtitle} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Controls - Left Panel */}
        <div className="w-full lg:w-1/3 space-y-6 lg:max-h-[85vh] lg:overflow-y-auto lg:pr-2">
          {/* Format Selector */}
          <Panneau titre={t.format}>
            <div className="grid grid-cols-2 gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`${TUILE} ${selectedFormat.id === fmt.id ? TUILE_ACTIVE : TUILE_INACTIVE}`}
                >
                  {fmt.icon}
                  <span className="mt-1">{fmt.label}</span>
                </button>
              ))}
            </div>
          </Panneau>

          {/* Text Layers */}
          <Panneau
            titre={t.layers}
            actions={
              <Bouton variante="secondaire" petit icone={Plus} onClick={addLayer}>
                {t.add}
              </Bouton>
            }
          >
            <div className="space-y-3">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-champ border transition-colors cursor-pointer ${
                    selectedLayerId === layer.id ? 'border-rose bg-rose/5' : 'border-filet hover:border-encre'
                  }`}
                  onClick={() => setSelectedLayerId(layer.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gris">ID : {layer.id}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      className="text-gris hover:text-rose"
                      aria-label={t.remove}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectedLayerId === layer.id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        className="w-full bg-papier border border-filet rounded-champ px-3 py-2 text-sm text-encre outline-none transition-colors focus:border-rose h-20 resize-none"
                        value={layer.text}
                        onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-16 bg-papier border border-filet rounded-champ px-2 py-1.5 text-xs text-encre outline-none transition-colors focus:border-rose"
                          value={layer.fontSize}
                          onChange={(e) => updateLayer(layer.id, { fontSize: parseInt(e.target.value) || 0 })}
                          title={t.size}
                        />
                        <button
                          type="button"
                          onClick={() => updateLayer(layer.id, { isBold: !layer.isBold })}
                          className={`px-3 rounded-champ border text-sm font-semibold ${
                            layer.isBold ? 'bg-bouton text-sur-bouton border-encre' : 'border-filet text-gris'
                          }`}
                        >
                          B
                        </button>
                        <input
                          type="color"
                          className="h-9 w-9 bg-transparent border border-filet rounded-champ cursor-pointer overflow-hidden"
                          value={layer.color}
                          onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-encre truncate">{layer.text}</p>
                  )}
                </div>
              ))}
            </div>
          </Panneau>

          {/* Background */}
          <Panneau titre={t.bgImg}>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-papier p-3 rounded-champ border border-filet">
                <span className="text-sm text-encre font-medium">{t.bw}</span>
                <button
                  type="button"
                  onClick={() => setIsGrayscale(!isGrayscale)}
                  aria-pressed={isGrayscale}
                  className={`w-12 h-6 rounded-pilule relative transition-colors ${isGrayscale ? 'bg-bouton' : 'bg-filet'}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-papier rounded-pilule transition-transform ${
                      isGrayscale ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBgImage(`/images/laurie-portrait-1.jpg`)}
                  className={`${TUILE} ${TUILE_INACTIVE}`}
                >
                  {t.random}
                </button>
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className={`${TUILE} ${TUILE_INACTIVE}`}
                >
                  {t.gallery}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNanoOpen(true)}
                  className={`col-span-2 ${TUILE} border-rose/30 text-rose hover:border-rose`}
                >
                  <Sparkles className="w-4 h-4" /> {t.nano}
                </button>
              </div>
            </div>
          </Panneau>
        </div>

        {/* Canvas - Right Panel */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          <div ref={containerRef} className="relative rounded-champ overflow-hidden border border-filet bg-encre">
            <canvas
              ref={canvasRef}
              width={selectedFormat.width}
              height={selectedFormat.height}
              className="max-h-[70vh] w-auto max-w-full cursor-move touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            />
            <div className="absolute bottom-4 right-4">
              <Bouton variante="primaire" icone={Download} onClick={handleDownload}>
                {t.download}
              </Bouton>
            </div>
          </div>
          <p className="text-gris text-sm mt-4 flex items-center gap-2">
            <Move className="w-4 h-4" /> {t.hint}
          </p>
        </div>
      </div>

      {/* GALLERY MODAL */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier-2 border border-filet rounded-champ shadow-panneau w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-filet flex justify-between items-center">
              <h2 className="font-serif text-h3 text-encre">{t.selectImg}</h2>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="text-gris hover:text-encre"
                aria-label={t.remove}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {gallery.length === 0 ? (
                <Vide titre={t.emptyGallery} />
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setBgImage(img.url);
                        setIsGalleryOpen(false);
                      }}
                      className="aspect-square rounded-champ overflow-hidden border border-filet hover:border-rose transition-colors relative group"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-encre/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-papier text-xs font-semibold">
                        {t.use}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NANO BANANA MODAL */}
      {isNanoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-encre/60">
          <div className="bg-papier-2 border border-filet rounded-champ shadow-panneau w-full max-w-md">
            <div className="p-6 border-b border-filet flex justify-between items-center">
              <h2 className="font-serif text-h3 text-encre flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose" /> {t.nanoTitle}
              </h2>
              <button
                type="button"
                onClick={() => setIsNanoOpen(false)}
                className="text-gris hover:text-encre"
                aria-label={t.remove}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div
                onClick={() => nanoFileInputRef.current?.click()}
                className={`relative w-full h-32 rounded-champ border border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                  nanoRefPreview ? 'border-rose/50 bg-papier' : 'border-filet hover:border-encre'
                }`}
              >
                {nanoRefPreview ? (
                  <>
                    <img src={nanoRefPreview} alt="Référence" className="h-full w-full object-contain opacity-60" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNanoRefPreview(null);
                        if (nanoFileInputRef.current) nanoFileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-papier-2 border border-filet text-encre rounded-pilule"
                      title={t.remove}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gris">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-xs">{t.uploadRef}</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={nanoFileInputRef}
                  onChange={handleNanoImageSelect}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <textarea
                className="w-full bg-papier border border-filet rounded-champ px-4 py-3 text-encre placeholder-gris outline-none transition-colors focus:border-rose h-32 resize-none"
                placeholder={t.nanoPlaceholder}
                value={nanoPrompt}
                onChange={(e) => setNanoPrompt(e.target.value)}
              />

              <Bouton variante="secondaire" icone={Sparkles} disabled className="w-full">
                {t.generate}
              </Bouton>
              <p className="text-xs text-gris text-center">{t.soon}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialCreator;
