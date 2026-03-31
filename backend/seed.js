import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Listing from './models/Listing.js';
import Article from './models/Article.js';
import Job from './models/Job.js';

dotenv.config();


const USERS = [
  {
    username: 'admin',
    email: 'admin@luxestate.com',
    password: bcrypt.hashSync('demo1234', 10),
    role: 'admin',
    phone: '+1 (800) 555-0000',
    bio: 'System Administrator managing the LuxEstate platform.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
];


const LISTINGS_DATA = [
  {
    title: 'Stunning Modern Villa with Ocean Views',
    description: 'An architectural masterpiece perched on the cliffs of Malibu. Features include a chef kitchen, wine cellar, home theater, and infinity pool.',
    address: '24 Pacific Coast Highway',
    city: 'Malibu',
    state: 'CA',
    zipCode: '90265',
    price: 12500000,
    category: 'villa',
    bedrooms: 6,
    bathrooms: 7,
    area: 8500,
    parking: true,
    furnished: true,
    pool: true,
    gym: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Contemporary Beverly Hills Estate',
    description: 'Nestled behind private gates in Beverly Hills. Floor-to-ceiling glass walls and a state-of-the-art smart home system.',
    address: '456 Rodeo Drive',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    price: 8900000,
    category: 'house',
    bedrooms: 5,
    bathrooms: 6,
    area: 7200,
    parking: true,
    furnished: true,
    pool: true,
    gym: true,
    petFriendly: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'Waterfront Miami Beach Condo',
    description: 'Spectacular waterfront residence in South Beach. Uninterrupted ocean views and a wraparound balcony perfect for entertaining.',
    address: '1 Ocean Drive, 2201',
    city: 'Miami Beach',
    state: 'FL',
    zipCode: '33139',
    price: 4200000,
    category: 'condo',
    bedrooms: 3,
    bathrooms: 3,
    area: 3200,
    parking: true,
    pool: true,
    petFriendly: true,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop',
    ],
  },
  {
    title: 'Historic Brownstone Upper West Side',
    description: 'A beautifully restored 1890s townhouse on one of the most sought-after blocks of the Upper West Side. Original mahogany details paired with modern updates.',
    address: '184 West 76th Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10023',
    price: 6800000,
    category: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 4200,
    parking: false,
    furnished: false,
    featured: true,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&auto=format&fit=crop',
    ],
  },
  {
    title: 'Luxury Penthouse Chicago Lakefront',
    description: 'Full floor penthouse atop one of Chicago most prestigious lakefront towers. Panoramic views of Lake Michigan and the city skyline.',
    address: '990 North Lake Shore Drive',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60611',
    price: 5500000,
    category: 'apartment',
    bedrooms: 4,
    bathrooms: 4,
    area: 5800,
    parking: true,
    furnished: true,
    gym: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop',
    ],
  },
  {
    title: 'Desert Modern Estate Scottsdale',
    description: 'A striking desert modern home with floor-to-ceiling windows framing dramatic mountain views. Resort-style pool and outdoor kitchen.',
    address: '8800 East Pinnacle Peak Road',
    city: 'Scottsdale',
    state: 'AZ',
    zipCode: '85255',
    price: 3900000,
    category: 'house',
    bedrooms: 5,
    bathrooms: 5,
    area: 6100,
    parking: true,
    furnished: true,
    pool: true,
    petFriendly: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop',
    ],
  },
  {
    title: 'Pacific Heights Victorian Mansion',
    description: 'A meticulously restored Victorian mansion in San Francisco most prestigious neighborhood. Original period details throughout.',
    address: '2800 Broadway Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94115',
    price: 9200000,
    category: 'house',
    bedrooms: 7,
    bathrooms: 6,
    area: 9100,
    parking: true,
    furnished: false,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format&fit=crop',
    ],
  },
  {
    title: 'Ultra Modern Studio Downtown Austin',
    description: 'Sleek studio in the heart of downtown Austin. Floor-to-ceiling windows, designer finishes, and access to world-class amenities.',
    address: '422 Congress Avenue',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    price: 850000,
    category: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 750,
    parking: true,
    furnished: true,
    gym: true,
    featured: false,
    status: 'active',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop',
    ],
  },
];

const ARTICLES_DATA = [
  {
    title: 'The Rise of Luxury Real Estate in 2025',
    content: 'The luxury real estate market continues to show remarkable resilience. Ultra-high-net-worth buyers are increasingly seeking properties that combine architectural excellence with sustainable design. From carbon-neutral mansions to smart homes powered entirely by renewable energy, the definition of luxury is evolving rapidly.',
    type: 'blog',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    author: 'LuxEstate Team',
  },
  {
    title: 'Top 5 Neighborhoods to Watch in 2025',
    content: 'Our analysts have identified five emerging neighborhoods that are poised for significant appreciation. These areas combine strong fundamentals — good schools, improving infrastructure, proximity to employment centers — with the early signs of gentrification that historically precede major value increases.',
    type: 'blog',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&auto=format&fit=crop',
    author: 'LuxEstate Team',
  },
  {
    title: 'LuxEstate Ranked Top Luxury Broker 2025',
    content: 'LuxEstate has been recognized as the top luxury real estate brokerage for the third consecutive year by the National Association of Realtors. The award recognizes our commitment to exceptional client service and our track record of achieving record sale prices across all major markets.',
    type: 'press',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    author: 'LuxEstate Team',
  },
];

const JOBS_DATA = [
  {
    title: 'Senior Luxury Property Consultant',
    department: 'Sales',
    location: 'Beverly Hills, CA',
    type: 'Full-time',
    description: 'We are seeking an experienced luxury property consultant with a proven track record in high-end residential sales. The ideal candidate has 5+ years of experience, an existing network of high-net-worth clients, and deep knowledge of the Los Angeles luxury market.',
    isActive: true,
  },
  {
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our marketing team to drive digital strategy for one of the most recognized luxury real estate brands. You will manage SEO, paid campaigns, social media, and content strategy across all our markets.',
    isActive: true,
  },
  {
    title: 'Property Photographer',
    department: 'Creative',
    location: 'Remote',
    type: 'Contract',
    description: 'We are looking for a talented architectural and interior photographer to capture our luxury listings. Must have a portfolio demonstrating experience with high-end residential properties and proficiency with drone photography.',
    isActive: true,
  },
];


async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Article.deleteMany({});
    await Job.deleteMany({});
    console.log('  Cleared existing data');

    // Create admin user
    const users = await User.insertMany(USERS);
    const adminUser = users[0];
    console.log(' Admin user created');

    // Create listings — all owned by admin
    const listingsWithOwner = LISTINGS_DATA.map(listing => ({
      ...listing,
      owner: adminUser._id,
    }));
    await Listing.insertMany(listingsWithOwner);
    console.log(` ${LISTINGS_DATA.length} listings created`);

    // Create articles
    await Article.insertMany(ARTICLES_DATA);
    console.log(` ${ARTICLES_DATA.length} articles created`);

    // Create jobs
    await Job.insertMany(JOBS_DATA);
    console.log(` ${JOBS_DATA.length} jobs created`);

    console.log(' Database seeded successfully');
    console.log('---');
    console.log('Demo login: admin@luxestate.com / demo1234');

  } catch (err) {
    console.error(' Seed error:', err);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
}

seed();