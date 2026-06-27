const mongoose = require('mongoose');
require('dotenv').config();

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const activitySchema = new mongoose.Schema({}, { strict: false });
const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema);

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB');
  
  const orders = await Order.find({});
  console.log('--- Orders in DB ---');
  console.log(JSON.stringify(orders, null, 2));
  
  const activities = await Activity.find({});
  console.log('--- Activities in DB ---');
  console.log(JSON.stringify(activities, null, 2));

  const users = await User.find({});
  console.log('--- Users in DB ---');
  console.log(JSON.stringify(users, null, 2));
  
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
