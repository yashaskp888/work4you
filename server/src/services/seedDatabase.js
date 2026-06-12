import Admin from '../models/Admin.js';
import ClientRequest from '../models/ClientRequest.js';

const SAMPLE_REQUESTS = [
  {
    organization: {
      name: 'TechNova Solutions',
      businessType: 'Startup',
      industry: 'Technology',
      ownerName: 'Sarah Mitchell',
      email: 'sarah@technova.com',
      mobile: '+1 555-0101',
      city: 'San Francisco',
      country: 'USA',
    },
    requirements: {
      websiteCategory: 'Business Website',
      purpose: 'Showcase SaaS product and generate leads',
      numberOfPages: '8-12',
      features: ['Contact Form', 'Blog', 'Analytics'],
      budget: '5000-10000',
      seoRequired: true,
      hostingRequired: true,
    },
    status: 'completed',
    estimatedRevenue: 7500,
    serviceType: 'Business Website',
  },
  {
    organization: {
      name: 'GreenLeaf Organics',
      businessType: 'E-Commerce',
      industry: 'Retail',
      ownerName: 'James Chen',
      email: 'james@greenleaf.com',
      mobile: '+1 555-0102',
      city: 'Portland',
      country: 'USA',
    },
    requirements: {
      websiteCategory: 'E-Commerce Website',
      purpose: 'Online store for organic products',
      numberOfPages: '15-20',
      features: ['Payment Gateway', 'Inventory', 'Reviews'],
      budget: '10000+',
      seoRequired: true,
      hostingRequired: true,
    },
    status: 'in_progress',
    estimatedRevenue: 12000,
    serviceType: 'E-Commerce Website',
  },
  {
    organization: {
      name: 'Metro Healthcare Group',
      businessType: 'Corporate',
      industry: 'Healthcare',
      ownerName: 'Dr. Emily Watson',
      email: 'emily@metrohealth.com',
      mobile: '+1 555-0103',
      city: 'Chicago',
      country: 'USA',
    },
    requirements: {
      websiteCategory: 'Industry Website',
      purpose: 'Patient portal and service information',
      numberOfPages: '20+',
      features: ['Appointment Booking', 'Patient Portal', 'Multi-language'],
      budget: '2500-5000',
      seoRequired: true,
      hostingRequired: true,
    },
    status: 'reviewing',
    estimatedRevenue: 3750,
    serviceType: 'Industry Website',
  },
];

export async function seedDatabase() {
  const email = process.env.ADMIN_EMAIL || 'admin@work4you.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

  let admin = await Admin.findOne({ email });
  if (!admin) {
    admin = await Admin.create({ name: 'Work4You Admin', email, password });
    console.log('Seed: admin created →', email);
  }

  const count = await ClientRequest.countDocuments();
  if (count === 0) {
    await ClientRequest.insertMany(SAMPLE_REQUESTS);
    console.log('Seed: sample client requests added');
  }
}
