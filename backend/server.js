const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mock Booking Endpoint
app.post('/api/visit-booking', (req, res) => {
  const { name, phone, email, date, grade } = req.body;

  // Simple validation
  if (!name || !phone || !date) {
    return res.status(400).json({
      success: false,
      message: 'გთხოვთ შეავსოთ სავალდებულო ველები: სახელი, ტელეფონი და თარიღი.'
    });
  }

  console.log('=== ახალი ვიზიტის ჯავშანი ===');
  console.log(`სახელი: ${name}`);
  console.log(`ტელეფონი: ${phone}`);
  console.log(`ელ-ფოსტა: ${email || 'არ არის მითითებული'}`);
  console.log(`თარიღი: ${date}`);
  console.log(`კლასი: ${grade || 'არ არის მითითებული'}`);
  console.log('=============================');

  return res.status(200).json({
    success: true,
    message: 'ვიზიტი წარმატებით დაიჯავშნა. ჩვენი წარმომადგენელი მალე დაგიკავშირდებათ.'
  });
});

// Mock Online Application Endpoint
app.post('/api/application', (req, res) => {
  const { studentName, parentName, phone, email, grade, additionalInfo } = req.body;

  // Simple validation
  if (!studentName || !parentName || !phone || !grade) {
    return res.status(400).json({
      success: false,
      message: 'გთხოვთ შეავსოთ სავალდებულო ველები: მოსწავლის სახელი, მშობლის სახელი, ტელეფონი და კლასი.'
    });
  }

  console.log('=== ახალი ონლაინ განაცხადი ===');
  console.log(`მოსწავლის სახელი: ${studentName}`);
  console.log(`მშობლის სახელი: ${parentName}`);
  console.log(`ტელეფონი: ${phone}`);
  console.log(`ელ-ფოსტა: ${email || 'არ არის მითითებული'}`);
  console.log(`კლასი: ${grade}`);
  console.log(`დამატებითი ინფორმაცია: ${additionalInfo || 'არ არის'}`);
  console.log('=============================');

  return res.status(200).json({
    success: true,
    message: 'განაცხადი წარმატებით გაიგზავნა. მადლობას გიხდით დაინტერესებისთვის!'
  });
});

// Base Route
app.get('/', (req, res) => {
  res.send('Georgian Private School API Server is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
