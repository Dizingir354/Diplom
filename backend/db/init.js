db = db.getSiblingDB('mydatabase');

// Создание коллекции и начальных данных
db.users.insertMany([
  { name: "Admin", email: "admin@example.com" }
]);

print("Database initialized with default data.");
