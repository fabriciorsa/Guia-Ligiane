CREATE DATABASE IF NOT EXISTS trilhas_db;
USE trilhas_db;
CREATE TABLE IF NOT EXISTS tours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  fullDescription TEXT NOT NULL,
  duration VARCHAR(100),
  date VARCHAR(100),
  price DECIMAL(10,2),
  images JSON,
  features JSON,
  rating DECIMAL(3,1) DEFAULT 5.0,
  reviews INT DEFAULT 0,
  maxPeople INT
);

INSERT INTO tours (title, subtitle, description, fullDescription, duration, date, price, images, features, rating, reviews, maxPeople)
VALUES
(
  'Ilha Pomonga com LALA RASTA',
  'No Tototó',
  'Um passeio relaxante pelo estuário, conhecendo a rica biodiversidade e a cultura local.',
  'Explore a Ilha Pomonga a bordo do tradicional Tototó. Um passeio que conecta você com a natureza vibrante do estuário, manguezais e a tranquilidade das águas sergipanas.',
  '5 horas',
  '01 de Março de 2026',
  160.00,
  '["/images/tours/pomonga.jpg", "/images/tours/pomonga.jpg"]',
  '["Passeio de Tototó", "Guia local", "Almoço típico", "Parada para banho", "Seguro viagem"]',
  4.8,
  124,
  20
),
(
  'Pacatuba',
  'Pantanal Sergipano',
  'Dunas, lagoas e uma paisagem de tirar o fôlego no coração de Sergipe.',
  'Conheça o Pantanal Sergipano em Pacatuba. Uma aventura off-road que leva você a dunas intocadas, lagoas cristalinas e mirantes com vistas espetaculares.',
  '8 horas',
  '08 de Março de 2026',
  220.00,
  '["/images/tours/pacatuba.jpg", "/images/tours/pacatuba.jpg"]',
  '["Transporte 4x4", "Guia especializado", "Lanche de trilha", "Fotos inclusas", "Taxas ambientais"]',
  4.9,
  89,
  12
),
(
  'Tur 3 Ilhas',
  'No Tototó',
  'Um roteiro completo visitando três ilhas paradisíacas em um único dia.',
  'Aventure-se no Tur 3 Ilhas a bordo do Tototó. Descubra paisagens únicas, bancos de areia e a vida marinha local em um passeio dinâmico e divertido.',
  '6 horas',
  '15 de Março de 2026',
  180.00,
  '["/images/tours/3ilhas.jpg", "/images/tours/3ilhas.jpg"]',
  '["Visita a 3 Ilhas", "Música a bordo", "Frutas tropicais", "Equipamento snorkel", "Refrigerante e água"]',
  5.0,
  215,
  25
),
(
  'Lagoa dos Tambaquis',
  '+ Paraíso da Lagoa (Pirambu)',
  'Interação com peixes e relaxamento em um complexo de lazer incrível.',
  'Visite a famosa Lagoa dos Tambaquis, onde você pode alimentar e nadar com os peixes. Em seguida, relaxe no Paraíso da Lagoa em Pirambu, com estrutura completa.',
  '7 horas',
  '22 de Março de 2026',
  150.00,
  '["/images/tours/tambaquis.jpg", "/images/tours/tambaquis.jpg"]',
  '["Entrada na Lagoa", "Ração para peixes", "Acesso ao Day Use", "Transporte Climatizado", "Almoço não incluso"]',
  4.7,
  340,
  30
),
(
  'Trilha Cachoeira Roncador',
  '+ Paraíso da Lagoa (Pirambu)',
  'Aventura na mata atlântica terminando em uma cachoeira refrescante.',
  'Faça a Trilha da Cachoeira do Roncador, encravada na mata. Após a caminhada, descanse e aproveite o dia no clube Paraíso da Lagoa em Pirambu.',
  '8 horas',
  '29 de Março de 2026',
  190.00,
  '["/images/tours/roncador.jpg", "/images/tours/roncador.jpg"]',
  '["Guia de trilha", "Banho de cachoeira", "Day Use no Clube", "Kit primeiros socorros", "Translado"]',
  4.9,
  156,
  15
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

