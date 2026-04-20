/**
 * ZK Rehab Sphere — Database Seed Script
 * Run: npm run seed (from the /backend directory)
 *
 * This seeds:
 * - 3 Expert profiles (the existing real team)
 * - Sample time slots for the next 7 days
 * - Sample resources (placeholder)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('./models/Expert');
const Slot = require('./models/Slot');
const Resource = require('./models/Resource');
const User = require('./models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB for seeding');
};

// ─── Expert Seed Data ──────────────────────────────────────────────────────────
const expertsData = [
  {
    name: 'Dr. Mehul Kumar',
    role: 'Senior Physiotherapist',
    degree: 'BPT',
    experience: '3+ Years Experience',
    bio: `Dr. Mehul Kumar is a senior physiotherapist with over 3 years of clinical experience in orthopedic and sports rehabilitation. He specializes in managing post-surgical recovery, musculoskeletal injuries, and movement dysfunction through structured and evidence-based rehabilitation protocols.

His expertise includes treating patients with knee and shoulder injuries, ligament rehabilitation, chronic back and neck pain, and post-fracture recovery. Dr. Mehul focuses on functional strengthening, mobility restoration, and long-term injury prevention to ensure sustainable outcomes for his patients.

With a strong emphasis on assessment-driven treatment planning, he combines manual therapy techniques with progressive exercise rehabilitation to optimize recovery and performance.`,
    image: '/uploads/experts/expert-mehul.jpeg',
    order: 1,
    specializations: ['Orthopedic Rehabilitation', 'Sports Injuries', 'Post-Surgical Recovery'],
  },
  {
    name: 'Dr. Mani Bhusan PT',
    role: 'Physiotherapist',
    degree: 'BPT',
    experience: '2+ Years Experience',
    bio: `Dr. Mani Bhusan is a dedicated physiotherapist with over 2 years of hands-on clinical experience in musculoskeletal and neurological rehabilitation. He specializes in structured, evidence-based treatment planning focused on restoring mobility, reducing pain, and improving functional independence.

His clinical work includes managing patients with stroke, paralysis, post-operative conditions, chronic back and neck pain, and sports-related injuries. Dr. Mani emphasizes detailed assessment, movement correction, and progressive strengthening protocols tailored to each patient's recovery goals.

With a patient-centered approach and commitment to continuous learning, he integrates modern rehabilitation techniques with practical home-based therapy models to deliver effective and measurable outcomes.`,
    image: '/uploads/experts/expert-mani.jpeg',
    order: 2,
    specializations: ['Neurological Rehabilitation', 'Stroke Recovery', 'Home-Based Therapy'],
  },
  {
    name: 'Dr. Mohammad Numan PT',
    role: 'Physiotherapist',
    degree: 'BPT',
    experience: 'Experience in core rehabilitation',
    bio: `Dr. Mohammad Numan is a committed physiotherapist with clinical experience in patient-centered rehabilitation and functional recovery. His focus lies in neurological and post-operative rehabilitation, helping patients regain mobility, strength, and independence through structured treatment planning.

He has worked with individuals managing stroke, paralysis, post-surgical conditions, and chronic musculoskeletal disorders. Dr. Numan emphasizes thorough assessment, guided therapeutic exercises, and progressive rehabilitation tailored to each patient's specific needs.

With a disciplined and evidence-based approach, he integrates modern physiotherapy techniques with practical home-visit rehabilitation models to deliver consistent and measurable outcomes.`,
    image: '/uploads/experts/expert-numan.jpeg',
    order: 3,
    specializations: ['Post-Operative Care', 'Paralysis Rehabilitation', 'Chronic Pain'],
  },
];

// ─── Resources Seed Data ───────────────────────────────────────────────────────
const resourcesData = [
  {
    title: 'Understanding Chronic Pain: A Physiotherapy Perspective',
    category: 'blog',
    description: 'An evidence-based guide to understanding chronic pain mechanisms and physiotherapy interventions.',
    tags: ['pain', 'chronic', 'rehabilitation'],
    author: 'ZK Rehab Sphere',
    isPublished: true,
    publishedAt: new Date(),
    content: '<p>Chronic pain is defined as pain lasting more than 3 months. Physiotherapy plays a crucial role in pain management through targeted exercises, manual therapy, and patient education...</p>',
  },
  {
    title: '5 Daily Stretches for Back Pain Relief',
    category: 'blog',
    description: 'Simple evidence-based stretches you can do at home to reduce lumbar back pain.',
    tags: ['stretches', 'back pain', 'home exercise'],
    author: 'Dr. Mehul Kumar',
    isPublished: true,
    publishedAt: new Date(),
    content: '<p>Back pain affects millions globally. Here are 5 clinically-proven stretches...</p>',
  },
  {
    title: 'Musculoskeletal Assessment Notes',
    category: 'clinical-notes',
    description: 'Comprehensive clinical notes covering musculoskeletal assessment techniques for physiotherapy students.',
    tags: ['musculoskeletal', 'assessment', 'students'],
    author: 'ZK Rehab Sphere',
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: 'Neurology Basics for Physiotherapy Practice',
    category: 'clinical-notes',
    description: 'Core neurological concepts essential for physiotherapy clinical practice.',
    tags: ['neurology', 'clinical notes', 'students'],
    author: 'Dr. Mani Bhusan PT',
    isPublished: true,
    publishedAt: new Date(),
  },
  {
    title: 'Patient Home Exercise Guide — Knee Rehabilitation',
    category: 'pdf',
    description: 'A printable home exercise guide for patients recovering from knee surgeries and injuries.',
    tags: ['knee', 'home exercise', 'patient guide'],
    author: 'ZK Rehab Sphere',
    isPublished: true,
    publishedAt: new Date(),
  },
];

// ─── Generate Slots for Next 7 Days ───────────────────────────────────────────
const generateSlots = (doctorId) => {
  const slots = [];
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    // Skip Sundays
    if (d.getDay() === 0) continue;

    const dateStr = d.toISOString().split('T')[0];
    times.forEach((time) => {
      slots.push({ doctor: doctorId, date: dateStr, time, isBooked: false, isActive: true });
    });
  }
  return slots;
};

// ─── Main Seed Function ────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('\n🗑️  Clearing existing seed data...');
    await Expert.deleteMany({});
    await Resource.deleteMany({});
    await Slot.deleteMany({});

    // Seed Experts
    console.log('👨‍⚕️ Seeding expert profiles...');
    const experts = await Expert.insertMany(expertsData);
    console.log(`   ✅ Created ${experts.length} experts`);

    // Seed Resources
    console.log('📚 Seeding resources...');
    const resources = await Resource.insertMany(resourcesData);
    console.log(`   ✅ Created ${resources.length} resources`);

    // Seed Slots (find doctor users, or create slots without linking — admin will link later)
    console.log('📅 Seeding appointment slots...');
    const doctorUsers = await User.find({ role: { $in: ['admin', 'doctor'] } }).limit(1);

    if (doctorUsers.length > 0) {
      const sampleSlots = generateSlots(doctorUsers[0]._id);
      const slotResult = await Slot.insertMany(sampleSlots, { ordered: false });
      console.log(`   ✅ Created ${slotResult.length} slots for ${doctorUsers[0].name}`);
    } else {
      console.log('   ⚠️  No doctor/admin users found. Slots not seeded. Login with admin Google account first, then re-run seed.');
    }

    console.log('\n🎉 Seeding complete!\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
