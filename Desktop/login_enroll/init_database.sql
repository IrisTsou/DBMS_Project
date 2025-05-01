CREATE DATABASE RentalSystem;
USE RentalSystem;

-- Landlord table
CREATE TABLE Landlord (
    landlord_ID INT PRIMARY KEY AUTO_INCREMENT,
    landlord_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    landlord_email VARCHAR(255) NOT NULL,
    landlord_telephone INT
);

-- Tenant table
CREATE TABLE Tenant (
    tenant_ID INT PRIMARY KEY AUTO_INCREMENT,
    tenant_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    tenant_email VARCHAR(255) NOT NULL,
    tenant_telephone INT
);

-- Property table
CREATE TABLE Property (
    property_ID INT PRIMARY KEY AUTO_INCREMENT,
    size DECIMAL(10,2),
    type VARCHAR(255),
    address VARCHAR(255),
    status INT,
    shared_Wifi TINYINT(1),
    shared_laundry TINYINT(1),
    shared_fridge TINYINT(1),
    shared_TV TINYINT(1),
    landlord_ID INT,
    FOREIGN KEY (landlord_ID) REFERENCES Landlord(landlord_ID)
);

-- Room table
CREATE TABLE Room (
    room_ID INT PRIMARY KEY AUTO_INCREMENT,
    size DECIMAL(10,2),
    type VARCHAR(255),
    status TINYINT(1),
    rent_date DATE,
    rent_price INT,
    individual_Wifi TINYINT(1),
    individual_laundry TINYINT(1),
    individual_fridge TINYINT(1),
    individual_TV TINYINT(1),
    tenant_ID INT,
    property_ID INT,
    FOREIGN KEY (tenant_ID) REFERENCES Tenant(tenant_ID),
    FOREIGN KEY (property_ID) REFERENCES Property(property_ID)
);

-- Announcement table
CREATE TABLE Announcement (
    announcement_ID INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    room_ID INT,
    date DATE,
    content VARCHAR(255),
    category VARCHAR(255),
    landlord_ID INT,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    FOREIGN KEY (landlord_ID) REFERENCES Landlord(landlord_ID)
);

-- Maintenance table
CREATE TABLE Maintenance (
    maintenance_ID INT PRIMARY KEY AUTO_INCREMENT,
    item VARCHAR(255),
    description VARCHAR(255),
    date DATE,
    status TINYINT(1),,
    room_ID INT,
    tenant_ID INT,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID),
    FOREIGN KEY (tenant_ID) REFERENCES Tenant(tenant_ID)
);

-- Expense table
CREATE TABLE Expense (
    room_ID INT PRIMARY KEY,
    date DATE,
    electricity_fees INT,
    water_fees INT,
    rental_expense INT,
    FOREIGN KEY (room_ID) REFERENCES Room(room_ID)
);