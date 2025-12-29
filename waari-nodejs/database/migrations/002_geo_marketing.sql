ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS isActive TINYINT(1) NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS role_permission_sets (
  rolePermissionSetId INT AUTO_INCREMENT PRIMARY KEY,
  roleId INT NOT NULL,
  catId INT NOT NULL,
  listIds JSON NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roleId) REFERENCES roles(roleId) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS continents (
  continentId INT AUTO_INCREMENT PRIMARY KEY,
  continentName VARCHAR(150) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_continent_name (continentName)
);

CREATE TABLE IF NOT EXISTS countries (
  countryId INT AUTO_INCREMENT PRIMARY KEY,
  continentId INT NOT NULL,
  countryName VARCHAR(150) NOT NULL,
  imageUrl VARCHAR(255),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
  UNIQUE KEY uq_country_name (continentId, countryName)
);

CREATE TABLE IF NOT EXISTS states (
  stateId INT AUTO_INCREMENT PRIMARY KEY,
  continentId INT NOT NULL,
  countryId INT NOT NULL,
  stateName VARCHAR(150) NOT NULL,
  imageUrl VARCHAR(255),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
  FOREIGN KEY (countryId) REFERENCES countries(countryId) ON DELETE CASCADE,
  UNIQUE KEY uq_state_name (countryId, stateName)
);

CREATE TABLE IF NOT EXISTS cities (
  cityId INT AUTO_INCREMENT PRIMARY KEY,
  continentId INT NOT NULL,
  countryId INT NOT NULL,
  stateId INT NOT NULL,
  cityName VARCHAR(150) NOT NULL,
  imageUrl VARCHAR(255),
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (continentId) REFERENCES continents(continentId) ON DELETE CASCADE,
  FOREIGN KEY (countryId) REFERENCES countries(countryId) ON DELETE CASCADE,
  FOREIGN KEY (stateId) REFERENCES states(stateId) ON DELETE CASCADE,
  UNIQUE KEY uq_city_name (stateId, cityName)
);

CREATE TABLE IF NOT EXISTS coupons (
  couponId INT AUTO_INCREMENT PRIMARY KEY,
  couponName VARCHAR(150) NOT NULL,
  fromDate DATE NOT NULL,
  toDate DATE NOT NULL,
  discountType TINYINT NOT NULL,
  discountValue DECIMAL(10,2) NOT NULL DEFAULT 0,
  maxDiscount DECIMAL(10,2),
  status TINYINT NOT NULL DEFAULT 1,
  isType TINYINT NOT NULL DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedbacks (
  feedbackId INT AUTO_INCREMENT PRIMARY KEY,
  tourName VARCHAR(150) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150),
  contact VARCHAR(20),
  startDate DATE,
  endDate DATE,
  feedback TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO continents (continentId, continentName)
VALUES
  (1, 'Asia'),
  (2, 'Europe'),
  (3, 'North America'),
  (4, 'South America'),
  (5, 'Africa'),
  (6, 'Oceania')
ON DUPLICATE KEY UPDATE continentName = VALUES(continentName);

INSERT INTO countries (countryId, continentId, countryName, imageUrl, description)
VALUES
  (1, 1, 'India', NULL, 'Key domestic market'),
  (2, 1, 'Japan', NULL, 'Outbound premium market'),
  (3, 2, 'France', NULL, 'Popular European destination'),
  (4, 3, 'United States', NULL, 'Growing corporate market'),
  (5, 5, 'South Africa', NULL, 'Adventure travel hub')
ON DUPLICATE KEY UPDATE
  continentId = VALUES(continentId),
  countryName = VALUES(countryName),
  imageUrl = VALUES(imageUrl),
  description = VALUES(description);

INSERT INTO states (stateId, continentId, countryId, stateName, imageUrl, description)
VALUES
  (1, 1, 1, 'Maharashtra', NULL, 'Western India state'),
  (2, 1, 1, 'Goa', NULL, 'Beach destination'),
  (3, 3, 4, 'California', NULL, 'West coast state'),
  (4, 2, 3, 'Île-de-France', NULL, 'Paris region')
ON DUPLICATE KEY UPDATE
  stateName = VALUES(stateName),
  imageUrl = VALUES(imageUrl),
  description = VALUES(description);

INSERT INTO cities (cityId, continentId, countryId, stateId, cityName, imageUrl, description)
VALUES
  (1, 1, 1, 1, 'Mumbai', NULL, 'Financial capital'),
  (2, 1, 1, 2, 'Panaji', NULL, 'Coastal city'),
  (3, 3, 4, 3, 'Los Angeles', NULL, 'Entertainment hub'),
  (4, 2, 3, 4, 'Paris', NULL, 'Capital city')
ON DUPLICATE KEY UPDATE
  cityName = VALUES(cityName),
  imageUrl = VALUES(imageUrl),
  description = VALUES(description);

INSERT INTO coupons (couponId, couponName, fromDate, toDate, discountType, discountValue, maxDiscount, status, isType)
VALUES
  (1, 'WELCOME100', '2024-01-01', '2025-12-31', 1, 100.00, NULL, 1, 2),
  (2, 'SUMMER15', '2025-04-01', '2025-09-30', 2, 15.00, 500.00, 1, 1),
  (3, 'WINTER50', '2025-10-01', '2026-02-28', 1, 50.00, NULL, 0, 1)
ON DUPLICATE KEY UPDATE
  couponName = VALUES(couponName),
  fromDate = VALUES(fromDate),
  toDate = VALUES(toDate),
  discountType = VALUES(discountType),
  discountValue = VALUES(discountValue),
  maxDiscount = VALUES(maxDiscount),
  status = VALUES(status),
  isType = VALUES(isType);

INSERT INTO feedbacks (feedbackId, tourName, name, email, contact, startDate, endDate, feedback)
VALUES
  (1, 'Ladakh Adventure', 'Aarav Shah', 'aarav@example.com', '+911234567890', '2025-05-01', '2025-05-10', 'Fantastic experience with great coordination.'),
  (2, 'Paris Explorer', 'Emma Dupont', 'emma@example.com', '+33123456789', '2025-03-15', '2025-03-22', 'Loved the curated itinerary and guides.'),
  (3, 'Cape Town Safari', 'Liam Brooks', 'liam@example.com', '+27123456789', '2025-02-05', '2025-02-12', 'Memorable safari with excellent hospitality.')
ON DUPLICATE KEY UPDATE
  tourName = VALUES(tourName),
  name = VALUES(name),
  email = VALUES(email),
  contact = VALUES(contact),
  startDate = VALUES(startDate),
  endDate = VALUES(endDate),
  feedback = VALUES(feedback);
