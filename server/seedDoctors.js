const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const UserModel = require('./models/UserModel');
const DocModel = require('./models/DocModel');

const doctorsData = [
  {
    fullName: "Emily Watson",
    email: "dr.emily.watson@medicare.com",
    specialization: "Cardiologist",
    experience: "12",
    fees: 150,
    phone: "+1-555-0101",
    location: "Manhattan, New York",
    address: "742 Evergreen Terrace, Suite 100",
    timings: ["09:00", "17:00"],
    rating: 4.9
  },
  {
    fullName: "Alexander Nian",
    email: "dr.alex.nian@medicare.com",
    specialization: "Dermatologist",
    experience: "8",
    fees: 120,
    phone: "+1-555-0102",
    location: "Brooklyn, New York",
    address: "120 Pine Street, Floor 2",
    timings: ["10:00", "18:00"],
    rating: 4.7
  },
  {
    fullName: "Sophia Martinez",
    email: "dr.sophia.m@medicare.com",
    specialization: "Pediatrician",
    experience: "15",
    fees: 100,
    phone: "+1-555-0103",
    location: "Queens, New York",
    address: "45 Elm Road, Building B",
    timings: ["08:30", "16:30"],
    rating: 4.8
  },
  {
    fullName: "David Kim",
    email: "dr.david.kim@medicare.com",
    specialization: "Neurologist",
    experience: "20",
    fees: 250,
    phone: "+1-555-0104",
    location: "Boston, Massachusetts",
    address: "303 Beacon Street, Suite 4A",
    timings: ["09:00", "15:00"],
    rating: 5.0
  },
  {
    fullName: "Olivia Chen",
    email: "dr.olivia.chen@medicare.com",
    specialization: "Ophthalmologist",
    experience: "10",
    fees: 130,
    phone: "+1-555-0105",
    location: "San Francisco, California",
    address: "555 Market St, Suite 210",
    timings: ["09:30", "17:30"],
    rating: 4.6
  },
  {
    fullName: "Marcus Aurelius",
    email: "dr.marcus.a@medicare.com",
    specialization: "Orthopedic Surgeon",
    experience: "18",
    fees: 220,
    phone: "+1-555-0106",
    location: "Rome, Italy",
    address: "Via dei Fori Imperiali, 22",
    timings: ["08:00", "14:00"],
    rating: 4.9
  },
  {
    fullName: "Sarah Jenkins",
    email: "dr.sarah.j@medicare.com",
    specialization: "Psychiatrist",
    experience: "14",
    fees: 180,
    phone: "+1-555-0107",
    location: "Seattle, Washington",
    address: "1001 Broadway, Suite 702",
    timings: ["11:00", "19:00"],
    rating: 4.7
  },
  {
    fullName: "Rajesh Koothrappali",
    email: "dr.rajesh.k@medicare.com",
    specialization: "Dentist",
    experience: "9",
    fees: 90,
    phone: "+1-555-0108",
    location: "Pasadena, California",
    address: "215 South Madison Ave",
    timings: ["09:00", "18:00"],
    rating: 4.5
  },
  {
    fullName: "Elena Rostova",
    email: "dr.elena.r@medicare.com",
    specialization: "Gynecologist",
    experience: "11",
    fees: 160,
    phone: "+1-555-0109",
    location: "Chicago, Illinois",
    address: "404 Michigan Ave, Suite 300",
    timings: ["09:00", "17:00"],
    rating: 4.8
  },
  {
    fullName: "Thomas Shelby",
    email: "dr.thomas.s@medicare.com",
    specialization: "Oncologist",
    experience: "16",
    fees: 240,
    phone: "+1-555-0110",
    location: "Birmingham, UK",
    address: "67 Watery Lane",
    timings: ["10:00", "16:00"],
    rating: 4.9
  },
  {
    fullName: "Lucas Silva",
    email: "dr.lucas.s@medicare.com",
    specialization: "General Practitioner",
    experience: "7",
    fees: 80,
    phone: "+1-555-0111",
    location: "Miami, Florida",
    address: "88 Ocean Drive, Suite 10",
    timings: ["08:00", "16:00"],
    rating: 4.6
  },
  {
    fullName: "Chloe Dubois",
    email: "dr.chloe.d@medicare.com",
    specialization: "Endocrinologist",
    experience: "13",
    fees: 170,
    phone: "+1-555-0112",
    location: "Paris, France",
    address: "14 Rue de Rivoli",
    timings: ["09:00", "17:00"],
    rating: 4.7
  },
  {
    fullName: "Kenji Sato",
    email: "dr.kenji.s@medicare.com",
    specialization: "Gastroenterologist",
    experience: "17",
    fees: 210,
    phone: "+1-555-0113",
    location: "Los Angeles, California",
    address: "1200 Wilshire Blvd, Suite 405",
    timings: ["10:00", "17:00"],
    rating: 4.9
  },
  {
    fullName: "Amara Okoye",
    email: "dr.amara.o@medicare.com",
    specialization: "Urologist",
    experience: "10",
    fees: 190,
    phone: "+1-555-0114",
    location: "Houston, Texas",
    address: "300 Fannin St, Suite 800",
    timings: ["08:30", "15:30"],
    rating: 4.8
  },
  {
    fullName: "William Osler",
    email: "dr.william.o@medicare.com",
    specialization: "General Practitioner",
    experience: "25",
    fees: 110,
    phone: "+1-555-0115",
    location: "Baltimore, Maryland",
    address: "601 N Caroline St",
    timings: ["09:00", "17:00"],
    rating: 5.0
  },
  {
    fullName: "Zara Ahmed",
    email: "dr.zara.a@medicare.com",
    specialization: "Rheumatologist",
    experience: "12",
    fees: 165,
    phone: "+1-555-0116",
    location: "London, UK",
    address: "24 Harley Street",
    timings: ["09:30", "16:30"],
    rating: 4.7
  },
  {
    fullName: "Gabriel Garcia",
    email: "dr.gabriel.g@medicare.com",
    specialization: "Allergist",
    experience: "8",
    fees: 115,
    phone: "+1-555-0117",
    location: "Austin, Texas",
    address: "1104 Guadalupe St",
    timings: ["08:00", "17:00"],
    rating: 4.6
  },
  {
    fullName: "Fatima Al-Sayed",
    email: "dr.fatima.a@medicare.com",
    specialization: "Cardiologist",
    experience: "14",
    fees: 180,
    phone: "+1-555-0118",
    location: "Dubai, UAE",
    address: "Sheikh Zayed Rd, Medical City",
    timings: ["09:00", "18:00"],
    rating: 4.9
  },
  {
    fullName: "Hans Zimmer",
    email: "dr.hans.z@medicare.com",
    specialization: "ENT Specialist",
    experience: "15",
    fees: 140,
    phone: "+1-555-0119",
    location: "Berlin, Germany",
    address: "54 Friedrichstraße",
    timings: ["10:00", "17:00"],
    rating: 4.8
  },
  {
    fullName: "Clara Schumann",
    email: "dr.clara.s@medicare.com",
    specialization: "Pediatrician",
    experience: "11",
    fees: 95,
    phone: "+1-555-0120",
    location: "Vienna, Austria",
    address: "12 Karlsplatz",
    timings: ["09:00", "16:00"],
    rating: 4.7
  },
  {
    fullName: "Alan Turing",
    email: "dr.alan.t@medicare.com",
    specialization: "Neurologist",
    experience: "16",
    fees: 230,
    phone: "+1-555-0121",
    location: "Cambridge, UK",
    address: "King's Parade, Suite 12",
    timings: ["09:00", "15:00"],
    rating: 4.9
  },
  {
    fullName: "Marie Curie",
    email: "dr.marie.c@medicare.com",
    specialization: "Oncologist",
    experience: "22",
    fees: 260,
    phone: "+1-555-0122",
    location: "Warsaw, Poland",
    address: "15 Freta Street",
    timings: ["08:30", "16:30"],
    rating: 5.0
  },
  {
    fullName: "Albert Einstein",
    email: "dr.albert.e@medicare.com",
    specialization: "Psychiatrist",
    experience: "19",
    fees: 200,
    phone: "+1-555-0123",
    location: "Princeton, New Jersey",
    address: "112 Mercer Street",
    timings: ["10:00", "16:00"],
    rating: 4.8
  },
  {
    fullName: "Isaac Newton",
    email: "dr.isaac.n@medicare.com",
    specialization: "Orthopedic Surgeon",
    experience: "24",
    fees: 250,
    phone: "+1-555-0124",
    location: "Lincolnshire, UK",
    address: "Woolsthorpe Manor Rd",
    timings: ["09:00", "14:00"],
    rating: 4.9
  },
  {
    fullName: "Gregor Mendel",
    email: "dr.gregor.m@medicare.com",
    specialization: "Endocrinologist",
    experience: "14",
    fees: 160,
    phone: "+1-555-0125",
    location: "Brno, Czech Republic",
    address: "1 Mendlovo náměstí",
    timings: ["08:30", "17:30"],
    rating: 4.7
  },
  {
    fullName: "Ada Lovelace",
    email: "dr.ada.l@medicare.com",
    specialization: "Dermatologist",
    experience: "10",
    fees: 135,
    phone: "+1-555-0126",
    location: "London, UK",
    address: "12 St James's Square",
    timings: ["09:00", "17:00"],
    rating: 4.8
  },
  {
    fullName: "Louis Pasteur",
    email: "dr.louis.p@medicare.com",
    specialization: "Immunologist",
    experience: "21",
    fees: 210,
    phone: "+1-555-0127",
    location: "Dole, France",
    address: "43 Rue Pasteur",
    timings: ["10:00", "18:00"],
    rating: 4.9
  },
  {
    fullName: "Charles Darwin",
    email: "dr.charles.d@medicare.com",
    specialization: "General Practitioner",
    experience: "17",
    fees: 100,
    phone: "+1-555-0128",
    location: "Shrewsbury, UK",
    address: "The Mount House, Suite B",
    timings: ["09:00", "16:00"],
    rating: 4.7
  },
  {
    fullName: "Alexander Fleming",
    email: "dr.alexander.f@medicare.com",
    specialization: "Infectious Disease Specialist",
    experience: "18",
    fees: 195,
    phone: "+1-555-0129",
    location: "Darvel, Scotland",
    address: "8 Lochfield Road",
    timings: ["09:00", "17:00"],
    rating: 4.9
  },
  {
    fullName: "Sigmund Freud",
    email: "dr.sigmund.f@medicare.com",
    specialization: "Psychiatrist",
    experience: "23",
    fees: 220,
    phone: "+1-555-0130",
    location: "Pribor, Czech Republic",
    address: "117 Freudova Street",
    timings: ["11:00", "18:00"],
    rating: 4.8
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_DB || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("No MongoDB connection URI found in env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    console.log("Cleaning existing doctor users and profiles...");
    const existingDoctorUsers = await UserModel.find({ isdoctor: true });
    const doctorUserIds = existingDoctorUsers.map(u => u._id);
    await UserModel.deleteMany({ _id: { $in: doctorUserIds } });
    await DocModel.deleteMany({});
    console.log("Clean complete.");

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("doctor123", salt);

    console.log("Seeding 30 doctors...");
    for (const doc of doctorsData) {
      // 1. Create User
      const user = new UserModel({
        fullName: doc.fullName,
        email: doc.email,
        password: passwordHash,
        phone: doc.phone,
        type: "user",
        isdoctor: true
      });
      const savedUser = await user.save();

      // 2. Create Doctor profile
      const doctorProfile = new DocModel({
        userID: savedUser._id,
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        location: doc.location,
        rating: doc.rating,
        specialization: doc.specialization,
        experience: doc.experience,
        fees: doc.fees,
        timings: doc.timings,
        status: "approved"
      });
      await doctorProfile.save();
    }

    console.log("Successfully seeded 30 doctors!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
