import mongoose from 'mongoose'
import 'dotenv/config'
import Product from '../models/Product.js'
import Category from '../models/Category.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ng:ng@cluster0.sypk7.mongodb.net/'

const CATEGORIES = [
  { name: 'Hijab Soie',   description: 'Foulards en soie naturelle, doux et lumineux' },
  { name: 'Hijab Coton',  description: 'Hijabs en coton respirant pour tous les jours' },
  { name: 'Hijab Crêpe',  description: 'Voiles en crêpe mate, élégants et modernes'   },
  { name: 'Hijab Jersey', description: 'Hijabs en jersey stretch, confortables'        },
  { name: 'Foulard Luxe', description: 'Pièces premium et éditions limitées'           },
]

const PRODUCTS = [
  {
    name: 'Hijab Soie Bleu Saphir',
    description: "Un hijab en soie naturelle d'un bleu saphir profond. Doux au toucher, lumineux et élégant. Idéal pour les occasions spéciales.",
    price: 18500,
    oldPrice: 22000,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    ],
    colors: ['bleu', 'saphir'],
    material: 'Soie naturelle 100%',
    dimensions: '180cm × 70cm',
    stock: 15,
    featured: true,
    isNew: true,
    tags: ['soie', 'bleu', 'luxe', 'fête'],
    categoryName: 'Hijab Soie',
  },
  {
    name: 'Hijab Crêpe Noir Élégant',
    description: 'Le classique intemporel. Hijab en crêpe de qualité supérieure, mat et fluide. Parfait pour le bureau comme pour les sorties.',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80',
    ],
    colors: ['noir'],
    material: 'Crêpe premium',
    dimensions: '175cm × 75cm',
    stock: 25,
    featured: true,
    isNew: false,
    tags: ['crêpe', 'noir', 'classique', 'bureau'],
    categoryName: 'Hijab Crêpe',
  },
  {
    name: 'Hijab Coton Rose Poudré',
    description: 'Douceur et féminité. Ce hijab en coton rose poudré est idéal pour le quotidien. Respirant et confortable toute la journée.',
    price: 9500,
    images: [
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    ],
    colors: ['rose'],
    material: 'Coton biologique',
    dimensions: '170cm × 70cm',
    stock: 30,
    featured: true,
    isNew: true,
    tags: ['coton', 'rose', 'quotidien', 'pastel'],
    categoryName: 'Hijab Coton',
  },
  {
    name: 'Hijab Soie Dorée',
    description: 'Éclat et sophistication. Ce hijab doré en soie pure capte la lumière magnifiquement. Une pièce de collection pour les grandes occasions.',
    price: 25000,
    oldPrice: 30000,
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    ],
    colors: ['or', 'doré'],
    material: 'Soie pure 22 mommes',
    dimensions: '180cm × 80cm',
    stock: 8,
    featured: true,
    isNew: false,
    tags: ['soie', 'or', 'luxe', 'mariage', 'fête'],
    categoryName: 'Foulard Luxe',
  },
  {
    name: 'Hijab Jersey Beige',
    description: 'Le must du confort ! Hijab en jersey stretch ultra-doux. Facile à mettre, reste en place toute la journée. Parfait pour le sport et le quotidien.',
    price: 7500,
    images: [
      'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
    ],
    colors: ['beige'],
    material: 'Jersey coton-lycra',
    dimensions: '170cm × 65cm',
    stock: 40,
    featured: false,
    isNew: true,
    tags: ['jersey', 'beige', 'sport', 'confort'],
    categoryName: 'Hijab Jersey',
  },
  {
    name: 'Hijab Crêpe Bordeaux',
    description: 'Profondeur et caractère. Ce hijab en crêpe bordeaux apporte une touche de sophistication à toutes vos tenues. Chute parfaite.',
    price: 13500,
    images: [
      'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80',
    ],
    colors: ['rouge', 'bordeaux'],
    material: 'Crêpe de Chine',
    dimensions: '175cm × 75cm',
    stock: 18,
    featured: false,
    isNew: false,
    tags: ['crêpe', 'bordeaux', 'rouge', 'élégant'],
    categoryName: 'Hijab Crêpe',
  },
  {
    name: 'Hijab Soie Vert Émeraude',
    description: 'Vitalité et fraîcheur. Ce hijab en soie vert émeraude est une déclaration de style. Sa couleur intense illumine le teint.',
    price: 20000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80',
    ],
    colors: ['vert'],
    material: 'Soie naturelle',
    dimensions: '180cm × 70cm',
    stock: 12,
    featured: true,
    isNew: true,
    tags: ['soie', 'vert', 'luxe', 'printemps'],
    categoryName: 'Hijab Soie',
  },
  {
    name: 'Hijab Coton Blanc Pur',
    description: "La pureté incarnée. Hijab en coton blanc d'une finesse remarquable. Un classique indémodable qui s'adapte à toutes les occasions.",
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
    ],
    colors: ['blanc'],
    material: 'Coton égyptien',
    dimensions: '170cm × 70cm',
    stock: 35,
    featured: false,
    isNew: false,
    tags: ['coton', 'blanc', 'classique', 'pur'],
    categoryName: 'Hijab Coton',
  },
  {
    name: 'Foulard Luxe Brodé Or',
    description: "Une pièce d'exception. Ce foulard luxe est orné de broderies dorées à la main. Édition limitée, pour les femmes qui aiment se démarquer.",
    price: 35000,
    oldPrice: 42000,
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    ],
    colors: ['or', 'crème'],
    material: 'Soie + broderies or 24k',
    dimensions: '200cm × 90cm',
    stock: 3,
    featured: true,
    isNew: true,
    tags: ['brodé', 'or', 'luxe', 'exclusif', 'mariage'],
    categoryName: 'Foulard Luxe',
  },
  {
    name: 'Hijab Jersey Gris Chiné',
    description: "Modernité et polyvalence. Ce hijab en jersey gris chiné s'accorde avec tout. Sa texture unique lui confère un aspect chic décontracté.",
    price: 8000,
    images: [
      'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=600&q=80',
      'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=600&q=80',
    ],
    colors: ['gris'],
    material: 'Jersey premium',
    dimensions: '170cm × 65cm',
    stock: 28,
    featured: false,
    isNew: false,
    tags: ['jersey', 'gris', 'casual', 'moderne'],
    categoryName: 'Hijab Jersey',
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI, { dbName: 'chezantabada' })
  console.log('✅ MongoDB connecté')

  // Clear existing
  await Category.deleteMany({})
  await Product.deleteMany({})
  console.log('🗑️  Collections vidées')

  // Create categories
  const catMap = {}
  for (const catData of CATEGORIES) {
    const cat = await Category.create(catData)
    catMap[cat.name] = cat._id
    console.log(`✅ Catégorie: ${cat.name}`)
  }

  // Create products
  for (const pData of PRODUCTS) {
    const { categoryName, ...data } = pData
    const product = await Product.create({
      ...data,
      category: catMap[categoryName],
    })
    console.log(`✅ Produit: ${product.name}`)
  }

  console.log('\n🎉 Seed terminé ! 10 produits créés.')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Erreur seed:', err)
  process.exit(1)
})
