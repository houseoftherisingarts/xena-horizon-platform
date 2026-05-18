import React, { useState, useRef } from 'react';
import { Upload, Trash2, Search, Plus, X, Image as ImageIcon, User, CornerDownRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { GalleryImage, Language } from '../types';
import { useCollection, createDoc, removeDoc, uploadFile, deleteFile, makeStoragePath } from '../lib/firestore';

interface AdminGalleryProps {
  currentProfileImage?: string;
  onUpdateProfileImage?: (url: string) => void;
  lang: Language;
}

const AdminGallery: React.FC<AdminGalleryProps> = ({ currentProfileImage, onUpdateProfileImage, lang }) => {
  const { data: gallery, loading } = useCollection<GalleryImage>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    FR: {
      title: 'Galerie Media',
      subtitle: 'Gérez votre bibliothèque d\'images.',
      addImage: 'Ajouter une image',
      uploading: 'Téléchargement...',
      profileTitle: 'Photo de Profil (Page d\'accueil)',
      dragText: 'Glissez une image de la galerie ci-dessous vers le cadre pour mettre à jour votre photo principale sur le site public.',
      dragActive: 'Drag & Drop activé',
      dropHere: 'Déposer ici',
      search: 'Rechercher une image...',
      deleteConfirm: 'Voulez-vous vraiment supprimer cette image ?',
      delete: 'Supprimer',
      setProfile: 'Définir comme profil',
      noImages: 'Aucune image trouvée.',
      loading: 'Chargement...'
    },
    EN: {
      title: 'Media Gallery',
      subtitle: 'Manage your image library.',
      addImage: 'Add Image',
      uploading: 'Uploading...',
      profileTitle: 'Profile Photo (Homepage)',
      dragText: 'Drag an image from the gallery below to the frame to update your main public site photo.',
      dragActive: 'Drag & Drop active',
      dropHere: 'Drop here',
      search: 'Search image...',
      deleteConfirm: 'Do you really want to delete this image?',
      delete: 'Delete',
      setProfile: 'Set as profile',
      noImages: 'No images found.',
      loading: 'Loading...'
    }
  }[lang];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      for (const file of Array.from(files)) {
        const path = makeStoragePath('gallery', file.name);
        const { url } = await uploadFile(path, file);
        await createDoc('gallery', {
          url,
          name: file.name,
          date: new Date().toISOString().split('T')[0],
          storagePath: path,
        });
      }
    } catch (err) {
      console.error('Gallery upload failed', err);
    } finally {
      setBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm(t.deleteConfirm)) return;
    try {
      if (image.storagePath) {
        await deleteFile(image.storagePath);
      }
      await removeDoc('gallery', image.id);
    } catch (err) {
      console.error('Gallery delete failed', err);
    }
  };

  const filteredImages = gallery.filter(img => img.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, url: string) => {
    e.dataTransfer.setData("text/plain", url);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const url = e.dataTransfer.getData("text/plain");
    if (url && onUpdateProfileImage) {
      onUpdateProfileImage(url);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <p className="text-slate-400">{t.loading}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className={`${ACTION_BUTTON_CLASSES} ${busy ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Upload className="w-4 h-4" /> {busy ? t.uploading : t.addImage}
          </button>
        </div>
      </div>

      {/* PROFILE PICTURE SLOT */}
      {onUpdateProfileImage && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
             <User className="w-5 h-5 text-blue-400" />
             <h3 className="font-bold text-white">{t.profileTitle}</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="w-full md:w-1/3">
                <p className="text-slate-400 text-sm mb-4">
                  {t.dragText}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CornerDownRight className="w-4 h-4" /> {t.dragActive}
                </div>
             </div>

             {/* DROP ZONE */}
             <div
               className={`relative w-40 h-40 md:w-48 md:h-48 rounded-[20px] overflow-hidden border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
                 dragOver
                   ? 'border-blue-500 bg-blue-500/10 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                   : 'border-white/20 bg-slate-900/50'
               }`}
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
             >
                {currentProfileImage ? (
                  <img src={currentProfileImage} alt="Current Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-slate-600" />
                )}

                {/* Overlay Text */}
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${dragOver ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                   <span className="text-xs font-bold text-white uppercase tracking-wider">{t.dropHere}</span>
                </div>
             </div>
          </div>
        </GlassCard>
      )}

      {/* Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={t.search}
          className={`${GLASS_INPUT_CLASSES} pl-10`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((img) => (
          <GlassCard
            key={img.id}
            className="p-3 group relative aspect-square flex flex-col cursor-grab active:cursor-grabbing"
            hoverEffect
          >
             {/* Draggable Image */}
             <div className="relative flex-1 rounded-[10px] overflow-hidden bg-slate-900 mb-3">
               <img
                 src={img.url}
                 alt={img.name}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 draggable
                 onDragStart={(e) => handleDragStart(e, img.url)}
               />

               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(img)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    title={t.delete}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {onUpdateProfileImage && (
                    <button
                      onClick={() => onUpdateProfileImage(img.url)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                      title={t.setProfile}
                    >
                      <User className="w-5 h-5" />
                    </button>
                  )}
               </div>
             </div>
             <div>
               <p className="text-sm font-bold text-white truncate">{img.name}</p>
               <p className="text-xs text-slate-500">{img.date}</p>
             </div>
          </GlassCard>
        ))}

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[20px]">
             <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
             <p className="text-slate-500">{t.noImages}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
