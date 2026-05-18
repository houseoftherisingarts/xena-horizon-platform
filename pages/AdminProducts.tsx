import React, { useState } from 'react';
import { Plus, MoreHorizontal, X, Trash2, Save, Edit3, Tag, Globe, Check, EyeOff } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { PRICE_RANGES, ACTION_BUTTON_CLASSES, GLASS_INPUT_CLASSES } from '../constants';
import { Product, ProductStatus, ProductCategory, Language } from '../types';
import { useCollection, createDoc, patchDoc, removeDoc } from '../lib/firestore';

interface AdminProductsProps {
  lang: Language;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ lang }) => {
  const { data: products, loading } = useCollection<Product>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const t = {
    FR: {
      title: 'Échelle de Valeur',
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
      hiddenStatus: 'Masqué du public'
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
      hiddenStatus: 'Hidden from public'
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

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Digital': return 'bg-purple-500/20 text-purple-300';
      case 'Service': return 'bg-blue-500/20 text-blue-300';
      case 'Consulting': return 'bg-amber-500/20 text-amber-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getStatusColor = (status: ProductStatus) => {
     switch(status) {
        case 'Active': return 'text-emerald-400 bg-emerald-400/10';
        case 'Planned': return 'text-blue-400 bg-blue-400/10';
        case 'Inactive': return 'text-slate-400 bg-slate-400/10';
        case 'Concept': return 'text-pink-400 bg-pink-400/10';
        default: return 'text-slate-400';
     }
  };

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
    // If publishing, ensure it's 'Active'. If unpublishing, keep it active or just hide it?
    // We'll just toggle visibility property, status remains Active usually unless user changes it.
    const nextStatus: ProductStatus = nextIsPublic ? 'Active' : product.status;

    await patchDoc<Product>('products', product.id, { isPublic: nextIsPublic, status: nextStatus });
  };

  return (
    <div className="pt-24 px-6 pb-12 h-screen flex flex-col relative">
      {loading && (
        <div className="text-sm text-slate-400 mb-4 max-w-[1920px] mx-auto w-full">Chargement...</div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 max-w-[1920px] mx-auto w-full gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">{t.title}</h1>
          <p className="text-slate-400">{t.subtitle}</p>
        </div>
        <button onClick={openNewModal} className={ACTION_BUTTON_CLASSES}>
          <Plus className="w-4 h-4" /> {t.newOffer}
        </button>
      </div>

      {/* Kanban / Ladder View */}
      <div className="flex-1 overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex gap-6 h-full min-w-max">
          {productsByRange.map((range, idx) => (
            <div key={idx} className="w-[280px] md:w-[320px] flex flex-col gap-4">
              
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                <h3 className={`font-bold text-sm ${range.color}`}>{range.label}</h3>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                  {range.products.length}
                </span>
              </div>

              {/* Column Drop Area */}
              <div className="flex-1 bg-white/5 rounded-[20px] border border-white/5 p-3 space-y-3 overflow-y-auto custom-scrollbar backdrop-blur-sm">
                {range.products.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[15px] text-slate-600 gap-2">
                    <span className="text-sm">{t.empty}</span>
                  </div>
                ) : (
                  range.products.map(product => (
                    <GlassCard 
                      key={product.id} 
                      className={`p-4 group relative hover:border-blue-500/50 transition-all cursor-pointer ${product.isPublic ? 'border-l-4 border-l-green-500' : ''}`}
                      onClick={() => openEditModal(product)}
                      hoverEffect
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                           <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-white/5 ${product.category === 'Service' ? 'bg-orange-500/20 text-orange-300' : 'bg-purple-500/20 text-purple-300'}`}>
                             {product.category === 'Service' ? t.service : t.product}
                           </span>
                        </div>
                        <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(product.status)}`}>
                           {product.status}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-white mb-2 leading-tight">{product.name}</h4>
                      <p className="text-xs text-slate-400 mb-4 line-clamp-3 leading-relaxed">{product.description}</p>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="text-lg font-bold text-white flex items-center gap-0.5">
                           {product.price === 0 ? t.free : `${product.price}$`}
                        </span>
                        
                        {/* Publish/Unpublish Quick Action */}
                        <button 
                           onClick={(e) => togglePublish(e, product)}
                           className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                              product.isPublic 
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                           }`}
                           title={product.isPublic ? t.unpublish : t.publish}
                        >
                           {product.isPublic ? (
                              <><Check className="w-3 h-3" /> {t.online}</>
                           ) : (
                              <><Globe className="w-3 h-3" /> {t.publish}</>
                           )}
                        </button>
                      </div>
                    </GlassCard>
                  ))
                )}
                
                {/* Add Quick Button */}
                <button 
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
                   className="w-full py-3 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-400 hover:bg-white/5 rounded-[15px] transition-all border border-transparent hover:border-white/10 border-dashed text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> {t.addHere}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT/CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
           <div className="bg-slate-900 border border-white/10 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900">
                 <h2 className="text-xl font-serif font-bold text-white">
                    {editingProduct ? t.editTitle : t.newTitle}
                 </h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.name}</label>
                    <input 
                       required 
                       type="text" 
                       className={GLASS_INPUT_CLASSES} 
                       value={formData.name} 
                       onChange={e => setFormData({...formData, name: e.target.value})} 
                       placeholder="Ex: Ebook Stratégie"
                    />
                 </div>
                 
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.category}</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-1 rounded-xl">
                       <button
                          type="button"
                          onClick={() => setFormData({...formData, category: 'Product'})}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.category === 'Product' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                       >
                          {t.product}
                       </button>
                       <button
                          type="button"
                          onClick={() => setFormData({...formData, category: 'Service'})}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.category === 'Service' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                       >
                          {t.service}
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.price} ($)</label>
                       <input 
                          required 
                          type="number" 
                          min="0"
                          step="0.01"
                          className={GLASS_INPUT_CLASSES} 
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                       />
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.subType}</label>
                       <select 
                          className={GLASS_INPUT_CLASSES} 
                          value={formData.type} 
                          onChange={e => setFormData({...formData, type: e.target.value as any})}
                       >
                          <option value="Digital">Digital</option>
                          <option value="Service">Service</option>
                          <option value="Consulting">Consulting</option>
                       </select>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.status}</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Active', 'Planned', 'Concept', 'Inactive'].map((status) => (
                          <button
                             key={status}
                             type="button"
                             onClick={() => setFormData({...formData, status: status as ProductStatus})}
                             className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                formData.status === status 
                                   ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50' 
                                   : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                             }`}
                          >
                             {status}
                          </button>
                       ))}
                    </div>
                 </div>
                 
                 {/* Publishing Toggle */}
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-[15px] border border-white/5">
                    <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                       {formData.isPublic ? <Globe className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                       {formData.isPublic ? t.onlineStatus : t.hiddenStatus}
                    </span>
                    <button 
                       type="button"
                       onClick={() => setFormData({...formData, isPublic: !formData.isPublic})}
                       className={`w-12 h-6 rounded-full relative transition-colors ${formData.isPublic ? 'bg-green-500' : 'bg-slate-700'}`}
                    >
                       <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isPublic ? 'translate-x-6' : ''}`} />
                    </button>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t.desc}</label>
                    <textarea 
                       className={`${GLASS_INPUT_CLASSES} h-24 resize-none`} 
                       value={formData.description} 
                       onChange={e => setFormData({...formData, description: e.target.value})} 
                       placeholder="Brève description de la valeur apportée..."
                    />
                 </div>

                 <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                    {editingProduct ? (
                       <button 
                          type="button" 
                          onClick={handleDelete}
                          className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-400/10 transition-colors text-sm font-medium"
                       >
                          <Trash2 className="w-4 h-4" /> {t.delete}
                       </button>
                    ) : <div></div>}
                    
                    <button type="submit" className={ACTION_BUTTON_CLASSES}>
                       <Save className="w-4 h-4" /> {t.save}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;