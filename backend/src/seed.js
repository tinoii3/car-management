const db = require('./db');

const sampleCars = [
  { registration_number: '1กข 1234', brand: 'Toyota', model: 'Yaris', year: 2021, color: 'White', notes: 'Main office car' },
  { registration_number: '2ขค 5678', brand: 'Honda', model: 'City', year: 2022, color: 'Black', notes: '' },
  { registration_number: '3คง 9012', brand: 'Mazda', model: '2', year: 2020, color: 'Red', notes: 'Needs service next month' },
  { registration_number: '4งจ 3456', brand: 'Nissan', model: 'Almera', year: 2023, color: 'Silver', notes: '' },
  { registration_number: '5จฉ 7890', brand: 'MG', model: 'ZS EV', year: 2024, color: 'Blue', notes: 'Electric car' },
];

const insert = db.prepare(
  `INSERT OR IGNORE INTO cars (registration_number, brand, model, year, color, notes)
   VALUES (?, ?, ?, ?, ?, ?)`
);

let count = 0;
for (const car of sampleCars) {
  count += insert.run(car.registration_number, car.brand, car.model, car.year, car.color, car.notes).changes;
}

console.log(`Seeded ${count} cars`);
