import React, { useState } from 'react';
import { Plus, X, Trash2, Save, Globe, EyeOff } from 'lucide-react';
import { EnTete, Panneau, Bouton, Champ, Zone, Selection, Chargement } from '../components/admin/ui';
import { EchelleValeur, type PalierOffres } from '../components/admin/offres/EchelleValeur';
import { PRODUITS_DEMO } from '../lib/offresDemo';
import { PRICE_RANGES } from '../constants';
import { Product, ProductStatus, ProductCategory, Language } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminProductsProps {
  lang: Language;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ lang }) => {
  const { data: productsFirestore, loading } = useCollection<Product>('products');
  // Boucle verdict sans compte admin (voir CLAUDE.md « boucle locale ») : un exemple en mémoire, jamais ailleurs.
  const enDemo = import.meta.env.MODE === 'verif' && productsFirestore.length === 0;
  const products = enDemo ? PRODUITS_DEMO : productsFirestore;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const t = {
    FR: {
      title: 'Échelle de valeur',
      subtitle: 'Gérez vos offres, de la gratuité à l\'exclusivité.',
      newOffer: 'Nouvelle Offre',
      empty: 'Vide',
      addHere: 'Ajouter ici',
      free: 'Gratuit',
      publish: 'Publier',
      unpublish: 'Dépublier',
      online: 'En ligne',
      editTitle: 'Modifier l\'offre',
      newTitle: 'Nouvelle Offre',
      name: 'Nom de l\'offre',
      category: 'Catégorie Principale',
      product: 'Produit',
      service: 'Service',
      price: 'Prix',
      subType: 'Sous-type',
      status: 'Statut',
      desc: 'Description',
      delete: 'Supprimer',
      save: 'Enregistrer',
      onlineStatus: 'En ligne sur la page Services',
      hiddenStatus: 'Masqué du public',
      loading: 'Chargement...'
    },
    EN: {
      title: 'Value Ladder',
      subtitle: 'Manage your offers, from freebies to exclusivity.',
      newOffer: 'New Offer',
      empty: 'Empty',
      addHere: 'Add Here',
      free: 'Free',
      publish: 'Publish',
      unpublish: 'Unpublish',
      online: 'Online',
      editTitle: 'Edit Offer',
      newTitle: 'New Offer',
      name: 'Offer Name',
      category: 'Main Category',
      product: 'Product',
      service: 'Service',
      price: 'Price',
      subType: 'Sub-type',
      status: 'Status',
      desc: 'Description',
      delete: 'Delete',
      save: 'Save',
      onlineStatus: 'Online on Services page',
      hiddenStatus: 'Hidden from public',
      loading: 'Loading...'
    }
  }[lang];

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    type: 'Digital',
    category: 'Product',
    status: 'Concept',
    isPublic: false
  });

  // Derived state for column view
  const productsByRange = PRICE_RANGES.map(range => ({
    ...range,
    products: products.filter(p => p.price >= range.min && p.price <= range.max)
  }));

  // HANDLERS
  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', type: 'Digital', category: 'Product', status: 'Concept', isPublic: false });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      const { id: _drop, ...partial } = formData as Partial<Product> & { id?: string };
      await patchDoc<Product>('products', editingProduct.id, partial);
    } else {
      // Create
      const payload: Omit<Product, 'id'> = {
        name: formData.name || t.newOffer,
        price: Number(formData.price) || 0,
        description: formData.description || '',
        type: (formData.type as any) || 'Digital',
        category: (formData.category as ProductCategory) || 'Product',
        status: (formData.status as ProductStatus) || 'Concept',
        isPublic: formData.isPublic || false,
        ...(formData.clientTypes ? { clientTypes: formData.clientTypes } : {}),
        ...(formData.variants ? { variants: formData.variants } : {})
      };
      await createDoc<Omit<Product, 'id'>>('products', payload);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: 0, description: '', type: 'Digital', category: 'Product', status: 'Concept', isPublic: false });
  };

  const handleDelete = async () => {
    if (editingProduct) {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        await removeDoc('products', editingProduct.id);
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    }
  };

  const togglePublish = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent opening modal
    const nextIsPublic = !product.isPublic;
    const nextStatus: ProductStatus = nextIsPublic ? 'Active' : product.status;
    await patchDoc<Product>('products', product.id, { isPublic: nextIsPublic, status: nextStatus });
  };

  return (
    <div className="px-6 md:px-10 py-10 space-y-8">
      <EnTete
        kicker={t.category}
        titre={t.title}
        lede={t.subtitle}
        actions={
          <Bouton variante="primaire" icone={Plus} onClick={openNewModal}>
            {t.newOffer}
          </Bouton>
        }
      />

      {loading && <Chargement texte={t.loading} />}

      {/* Kanban / Ladder View */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {productsByRange.map((range, idx) => (
            <div key={idx} className="w-[280px] md:w-[320px] flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-papier-2 border border-filet rounded-champ">
                <h3 className="kicker text-gris">{range.label}</h3>
                <Etiquette tone="neutre">{range.products.length}</Etiquette>
              </div>

              {/* Column Drop Area */}
              <div className="flex-1 bg-papier border border-filet rounded-champ p-3 space-y-3">
                {range.products.length === 0 ? (
                  <Vide titre={t.empty} />
                ) : (
                  range.products.map(product => (
                    <div
                      key={product.id}
                      onClick={() => openEditModal(product)}
                      className="bg-papier-2 border border-filet rounded-champ p-4 cursor-pointer transition-colors hover:border-encre"
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <Etiquette tone="neutre">{product.category === 'Service' ? t.service : t.product}</Etiquette>
                        <Etiquette tone={product.status === 'Active' ? 'accent' : 'neutre'}>{product.status}</Etiquette>
                      </div>

                      <h4 className="font-sans font-semibold text-encre mb-2 leading-tight">{product.name}</h4>
                      <p className="text-xs text-gris mb-4 line-clamp-3 leading-relaxed">{product.description}</p>

                      <div className="flex justify-between items-center pt-3 border-t border-filet">
                        <span className="font-serif text-lg text-encre tabular-nums">
                          {product.price === 0 ? t.free : `${product.price}$`}
                        </span>

                        {/* Publish/Unpublish Quick Action */}
                        <button
                          onClick={(e) => togglePublish(e, product)}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded-pilule transition-colors ${
                            product.isPublic ? 'bg-rose/10 text-rose' : 'text-gris hover:text-encre'
                          }`}
                          title={product.isPublic ? t.unpublish : t.publish}
                        >
                          {product.isPublic ? (
                            <>
                              <Check className="w-3 h-3" /> {t.online}
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3" /> {t.publish}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}

                {/* Add Quick Button */}
                <Bouton
                  variante="discret"
                  icone={Plus}
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      price: range.min === 0 ? 0 : Math.ceil(range.min),
                      description: '',
                      type: 'Digital',
                      category: 'Product',
                      status: 'Concept',
                      isPublic: false
                    });
                    setIsModalOpen(true);
                  }}
                  className="w-full"
                >
                  {t.addHere}
                </Bouton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT/CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-encre/60">
          <Panneau className="shadow-panneau w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] !p-0">
            <div className="p-6 border-b border-filet flex justify-between items-center">
              <h2 className="font-serif text-h3 text-encre">{editingProduct ? t.editTitle : t.newTitle}</h2>
              <button onClick={() => setIsModalOpen(false)} aria-label={t.delete === 'Supprimer' ? 'Fermer' : 'Close'} className="w-11 h-11 -mr-2 flex items-center justify-center text-gris hover:text-encre">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
              <Champ
                label={t.name}
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Ebook Stratégie"
              />

              <div>
                <p className="text-petit font-semibold text-encre mb-1.5">{t.category}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Bouton
                    type="button"
                    petit
                    variante={formData.category === 'Product' ? 'primaire' : 'secondaire'}
                    onClick={() => setFormData({ ...formData, category: 'Product' })}
                  >
                    {t.product}
                  </Bouton>
                  <Bouton
                    type="button"
                    petit
                    variante={formData.category === 'Service' ? 'primaire' : 'secondaire'}
                    onClick={() => setFormData({ ...formData, category: 'Service' })}
                  >
                    {t.service}
                  </Bouton>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Champ
                  label={`${t.price} ($)`}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
                <Selection
                  label={t.subType}
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="Digital">Digital</option>
                  <option value="Service">Service</option>
                  <option value="Consulting">Consulting</option>
                </Selection>
              </div>

              <div>
                <p className="text-petit font-semibold text-encre mb-1.5">{t.status}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Active', 'Planned', 'Concept', 'Inactive'] as ProductStatus[]).map(status => (
                    <Bouton
                      key={status}
                      type="button"
                      petit
                      variante={formData.status === status ? 'primaire' : 'secondaire'}
                      onClick={() => setFormData({ ...formData, status })}
                    >
                      {status}
                    </Bouton>
                  ))}
                </div>
              </div>

              {/* Publishing Toggle */}
              <div className="flex items-center justify-between p-3 bg-papier border border-filet rounded-champ">
                <span className="text-sm font-medium text-encre flex items-center gap-2">
                  {formData.isPublic ? <Globe className="w-4 h-4 text-rose" /> : <EyeOff className="w-4 h-4 text-gris" />}
                  {formData.isPublic ? t.onlineStatus : t.hiddenStatus}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`w-12 h-6 rounded-pilule relative transition-colors ${formData.isPublic ? 'bg-rose' : 'bg-filet'}`}
                  aria-pressed={!!formData.isPublic}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-papier rounded-pilule transition-transform ${formData.isPublic ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <Zone
                label={t.desc}
                className="[&_textarea]:min-h-[6rem]"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brève description de la valeur apportée..."
              />

              <div className="pt-4 flex items-center justify-between border-t border-filet mt-4">
                {editingProduct ? (
                  <Bouton type="button" variante="danger" petit icone={Trash2} onClick={handleDelete}>
                    {t.delete}
                  </Bouton>
                ) : (
                  <div></div>
                )}

                <Bouton type="submit" variante="primaire" icone={Save}>
                  {t.save}
                </Bouton>
              </div>
            </form>
          </Panneau>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
