CREATE DATABASE aste_snap;
\c aste_snap
CREATE TABLE asta (
  id_asta SERIAL PRIMARY KEY,
  username_creator varchar(50) NOT NULL, 
  nome_oggetto varchar(50) NOT NULL,
  min_partecipanti INT NOT NULL,
  max_partecipanti INT NOT NULL,
  quota_partecipazione INT NOT NULL,
  durata_asta_minuti decimal(5,2) NOT NULL,
  stato varchar(10) NOT NULL,
  incremento_puntata INT NOT NULL,
  max_n_puntate_partecipante INT NOT NULL,
  max_prezzo_asta INT NOT NULL,
  username_vincitore varchar(50) NOT NULL,
  tot_prezzo_aggiudicato INT NOT NULL,
  num_attuale_partecipanti INT NOT NULL
);

CREATE TABLE partecipazione (
  id_partecipazione SERIAL PRIMARY KEY,
  id_asta INT NOT NULL,
  username varchar(50) NOT NULL,
  spesa_partecipazione INT NOT NULL,
  asta_vinta BOOLEAN NOT NULL,
  contatore_puntate INT NOT NULL
);

CREATE TABLE puntata (
  id_puntata SERIAL PRIMARY KEY,
  id_partecipazione INT NOT NULL,
  username varchar(50) NOT NULL,
  time_ultimo_rilancio timestamp NOT NULL
);

CREATE TABLE users(
  username varchar(50) NOT NULL,
  credito INT NOT NULL,
  ruolo varchar(50) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (username);

INSERT INTO users (username, credito, ruolo) 
  VALUES 
  ('adriano_mancini', 100, 'bid_partecipant'), 
  ('lucrezia_antenucci', 100, 'bid_partecipant'),
  ('sam_leli', 100, 'bid_partecipant'),
  ('luca_rossi', 100, 'bid_partecipant'),
  ('rita_bianchi', 100, 'bid_partecipant'),
  ('xi_li', 100, 'bid_partecipant'),
  ('petra96', 100, 'bid_partecipant'),
  ('giulia_stracci', 100, 'bid_partecipant'),
  ('simo_dirado', 100, 'bid_partecipant'),
  ('andrea_felicetti', 0, 'bid_creator'),
  ('sara_bianchi', 0, 'bid_creator'),
  ('admin', 0, 'admin');