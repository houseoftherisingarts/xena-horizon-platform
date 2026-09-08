import React, { useState, useRef } from 'react';
import { Upload, Trash2, User, CornerDownRight } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Vide, Chargement } from '../components/admin/ui';
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
      profileTitle: 'Photo de profil (page d\'accueil)',
      dragText: 'Glissez une image de la galerie ci-dessous vers le cadre pour mettre à jour votre photo principale sur le site public.',
      dragActive: 'Glisser-déposer activé',
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
      profileTitle: 'Profile photo (homepage)',
      dragText: 'Drag an image from the gallery below to the frame to update your main public site photo.',
      dragActive: 'Drag and drop active',
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
      for (const file of Array.from(files) as File[]) {
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
      <div className="px-6 md:px-10 py-10">
        <Chargement texte={t.loading} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete
        kicker="Médiathèque"
        titre={t.title}
        lede={t.subtitle}
        actions={
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              accept="image/*"
              multiple
            />
            <Bouton icone={Upload} onClick={() => fileInputRef.current?.click()} disabled={busy}>
              {busy ? t.uploading : t.addImage}
            </Bouton>
          </>
        }
      />

      {onUpdateProfileImage && (
        <Panneau titre={t.profileTitle}>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <p className="text-gris text-sm mb-4 mesure">{t.dragText}</p>
              <div className="flex items-center gap-2 text-xs text-gris">
                <CornerDownRight className="w-4 h-4" aria-hidden="true" /> {t.dragActive}
              </div>
            </div>

            <div
              className={`relative w-40 h-40 md:w-48 md:h-48 rounded-champ overflow-hidden border-2 border-dashed transition-colors flex items-center justify-center ${
                dragOver ? 'border-rose bg-rose/5' : 'border-filet bg-papier'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {currentProfileImage ? (
                <img src={currentProfileImage} alt="Photo de profil actuelle" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gris" aria-hidden="true" />
              )}

              <div className={`absolute inset-0 bg-encre/70 flex items-center justify-center transition-opacity ${dragOver ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                <span className="text-xs font-semibold text-papier uppercase tracking-wider">{t.dropHere}</span>
              </div>
            </div>
          </div>
        </Panneau>
      )}

      <div className="max-w-md">
        <Champ
          label={t.search}
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredImages.length === 0 ? (
        <Vide titre={t.noImages} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className="border border-filet rounded-champ p-3 group relative aspect-square flex flex-col cursor-grab active:cursor-grabbing"
            >
              <div className="relative flex-1 rounded-champ overflow-hidden bg-papier mb-3">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  draggable
                  onDragStart={(e) => handleDragStart(e, img.url)}
                />

                <div className="absolute inset-0 bg-encre/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDelete(img)}
                    className="w-11 h-11 flex items-center justify-center rounded-pilule bg-papier text-rose hover:bg-rose hover:text-papier transition-colors"
                    title={t.delete}
                    aria-label={t.delete}
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                  {onUpdateProfileImage && (
                    <button
                      onClick={() => onUpdateProfileImage(img.url)}
                      className="w-11 h-11 flex items-center justify-center rounded-pilule bg-papier text-encre hover:bg-bouton hover:text-sur-bouton transition-colors"
                      title={t.setProfile}
                      aria-label={t.setProfile}
                    >
                      <User className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-encre truncate">{img.name}</p>
                <p className="text-xs text-gris">{img.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
