const mongoose = require('mongoose');
require('dotenv').config();
const { MenuItem, Reservation, Contact, BlogPost } = require('./models/Dynamic');

const seedMenu = [
  { name:"Raj's Golden Toast",    category:'Signature', price:495, tag:'Bestseller',   emoji:'🍞', visible:true },
  { name:"Saffron Latte",         category:'Coffee',    price:345, tag:'Award-Winning', emoji:'☕', visible:true },
  { name:"Heritage Shakshuka",    category:'Signature', price:550, tag:"Chef's Pick",  emoji:'🍳', visible:true },
  { name:"Full Raj Breakfast",    category:'Breakfast', price:795, tag:'',              emoji:'🍽', visible:true },
  { name:"Dark Chocolate Fondant",category:'Desserts',  price:545, tag:'Must Try',     emoji:'🍫', visible:true },
  { name:"Cold Brew Reserve",     category:'Coffee',    price:325, tag:'Signature',    emoji:'🧊', visible:true },
];

const seedReservations = [
  { name:'Priya Mehra',    date:'2026-04-05', time:'19:00', guests:2, email:'priya@email.com',  phone:'+91 9876543210', status:'confirmed', occasion:'Anniversary' },
  { name:'James Thornton', date:'2026-04-06', time:'13:00', guests:4, email:'james@email.com',  phone:'+91 9999988888', status:'pending'   },
  { name:'Ananya Krishnan',date:'2026-04-06', time:'20:00', guests:6, email:'ananya@email.com', phone:'+91 9123456789', status:'pending',   occasion:'Birthday'  },
  { name:'Rohan Verma',    date:'2026-04-07', time:'09:00', guests:1, email:'rohan@email.com',  phone:'+91 9000000001', status:'cancelled'  },
];

const seedContacts = [
  { name:'Sophie Laurent', email:'sophie@email.fr', subject:'Private Event Inquiry', message:"Hello, I'd like to inquire about hosting a corporate dinner for 25 guests next month. Please share availability and menu options.", status:'unread', createdAt:'2026-03-30' },
  { name:'Vikram Singh',   email:'vikram@email.in', subject:'Catering Partnership', message:"We are planning a corporate event and would love Raj's Cafe to cater. Could you send over your catering packages?", status:'read', createdAt:'2026-03-29' },
];

const seedPosts = [
  { title:'Spring Menu Launch 2026', excerpt:'Discover our vibrant seasonal specials featuring locally sourced spring produce and new artisan coffee blends.', status:'published', date:'2026-03-15' },
  { title:"Chef Raj Wins Top Cafe Award", excerpt:"We are thrilled to announce that Raj's Cafe has been awarded Best Luxury Cafe in Delhi for the third consecutive year.", status:'published', date:'2026-03-01' },
  { title:'Upcoming Easter Brunch Event', excerpt:"Join us for an exclusive Easter Sunday brunch with live music, a champagne station, and a special kids' activity corner.", status:'draft', date:'2026-04-01' },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB');
  
  if ((await MenuItem.countDocuments()) === 0) await MenuItem.insertMany(seedMenu);
  if ((await Reservation.countDocuments()) === 0) await Reservation.insertMany(seedReservations);
  if ((await Contact.countDocuments()) === 0) await Contact.insertMany(seedContacts);
  if ((await BlogPost.countDocuments()) === 0) await BlogPost.insertMany(seedPosts);

  console.log('Database seeded!');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
