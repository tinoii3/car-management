const db = require('../db');

function validateCar(data) {
  const errors = [];

  if (!data.registration_number || !data.registration_number.trim()) {
    errors.push('registration_number is required');
  }
  if (!data.brand || !data.brand.trim()) {
    errors.push('brand is required');
  }
  if (!data.model || !data.model.trim()) {
    errors.push('model is required');
  }
  if (data.year) {
    const year = Number(data.year);
    const nextYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1900 || year > nextYear) {
      errors.push(`year must be between 1900 and ${nextYear}`);
    }
  }

  return errors;
}

function isDuplicateError(err) {
  return err.message && err.message.includes('UNIQUE constraint failed');
}

function cleanCar(data) {
  return {
    registration_number: data.registration_number.trim(),
    brand: data.brand.trim(),
    model: data.model.trim(),
    year: data.year ? Number(data.year) : null,
    color: data.color ? data.color.trim() : null,
    notes: data.notes ? data.notes.trim() : null,
  };
}

function getAllCars(req, res) {
  const cars = db.prepare('SELECT * FROM cars ORDER BY id DESC').all();
  res.json(cars);
}

function getCarById(req, res) {
  const car = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);

  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.json(car);
}

function createCar(req, res) {
  const errors = validateCar(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const car = cleanCar(req.body);

  try {
    const result = db
      .prepare(
        `INSERT INTO cars (registration_number, brand, model, year, color, notes)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(car.registration_number, car.brand, car.model, car.year, car.color, car.notes);

    const newCar = db.prepare('SELECT * FROM cars WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCar);
  } catch (err) {
    if (isDuplicateError(err)) {
      return res.status(409).json({ message: 'This registration number already exists' });
    }
    throw err;
  }
}

function updateCar(req, res) {
  const existing = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Car not found' });
  }

  const errors = validateCar(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const car = cleanCar(req.body);

  try {
    db.prepare(
      `UPDATE cars
       SET registration_number = ?, brand = ?, model = ?, year = ?, color = ?, notes = ?,
           updated_at = datetime('now', 'localtime')
       WHERE id = ?`
    ).run(car.registration_number, car.brand, car.model, car.year, car.color, car.notes, req.params.id);

    const updatedCar = db.prepare('SELECT * FROM cars WHERE id = ?').get(req.params.id);
    res.json(updatedCar);
  } catch (err) {
    if (isDuplicateError(err)) {
      return res.status(409).json({ message: 'This registration number already exists' });
    }
    throw err;
  }
}

function deleteCar(req, res) {
  const result = db.prepare('DELETE FROM cars WHERE id = ?').run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.status(204).send();
}

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
