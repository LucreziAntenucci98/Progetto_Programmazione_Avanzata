# Progetto-Programmazione-Avanazata 

## Team

**• Antenucci Lucrezia** \
**• Leli Samuele**

## Obiettivo del Progetto

L'obiettivo del progetto è stato quello di realizzare un servizio di back-end utilizzando dei framework e delle librerie specifiche, per consentire la gestione di aste di tipo snap.
Nel sistema si hanno tre tipi di utenti: 
* Bid-partecipant: sono gli utenti che possono partecipare alle aste e gestire il loro "wallet";
* Bid-creator: sono gli utenti che mettono all'asta gli oggetti;
* Admin: sono gli utenti che eseguono le operazioni non propriamente legate all'asta.

Le specifiche richieste per l'implementazione sono:

**• Creare una nuova asta (ruolo bid-creator);** \
**• Visualizzare l'elenco delle asta, filtrandole per stato (creata, aperta, rilancio, terminata), non è necessaria l'autenticazione;** \
**• Partecipare ad un'asta, l'asta deve essere nello stato "aperta" (ruolo bid-partecipant);** \
**• Rilanciare, l'asta deve essere nello stato "rilancio", (ruolo bid-creator);** \
**• Visualizzare l'elenco dei rilanci per un'asta alla quale si sta partecipando e si è nella fase di rilancio (ruolo bid-partecipant e bid-creator);** \
**• Gestione del "wallet" degli utenti, dell'iscrizione, del caso in cui non si raggiunge il numero di partecipanti, del credito(somma dei costi di iscrizione + prezzo massimo asta), con eventuale rifiuto, (ruolo bid-partecipant);** \
**• Visualizzazione del proprio credito residuo, ruolo(bid-partecipant);** \
**• Creazione di una rotta per ricaricare l'utente, (ruolo admin);** \
**• Dopo essersi aggiudicati l'asta , viene scalato il credito;** \
**• Visualizzazione dello storico delle aste (aggiudicate e non), (ruolo bid-partecipant);** \
**• Visualizzare la spesa effettuata in un dato periodo temporale a seguito delle eventuali aggiudicazioni intercorse oltre che alle quote di iscrizioni effettivamente scalate (ruolo bid-partecipant);** \
•**Fornire delle statistiche attraverso le quali in un dato intervallo temporale è necessario fornire i seguenti dettagli, (ruolo admin)**: 

  * n° di aste completate con successo ;
  
  * n° aste terminate per non aver raggiunto il numero minimo di iscritti;
  
  * Media del rapporto tra numero di puntate effettuate e numero massimo di puntate effettuabili.


Ogni azione corrisponde a una differente richiesta HTTP (GET o POST) che deve essere, o meno, autenticata tramite token JWT.

I token JWT sono stati generati tramite il seguente sito:
* [JWT.io](https://jwt.io/) utilizzando la chiave segreta "secretkey".


## Strumenti Utilizzati 

* [Visual Studio Code](https://code.visualstudio.com/)
* [Docker](https://docs.docker.com/)
* [Postman](https://www.postman.com/)

## Librerie/Framework

* [Node.JS](https://nodejs.org/en/)
* [Express](http://expressjs.com/) 
* [Sequelize](https://sequelize.org/) 
* [Postgres](https://www.postgresql.org/)


## Richieste
Tipo          | Rotta                         | Autenticazione JWT   |Ruolo
------------- | ----------------------------- |----------------------|-----------------
Post          | /creaAsta                     | si                   |bid-creator
Post          | /partecipaAsta                | si                   |bid-partecipant
Post          | /rilancia                     | si                   |bid-partecipant
Post          | /ricaricaUtente               | si                   |Admin
Get           | /verificaCreditoResidio       | si                   |bid-partecipant
Get           | /elencoRilanci                | si                   |bid-partecipant & bid-creator
Get           | /storicoAste                  | si                   |bid-partecipant
Get           | /speseEffettuate              | si                   |bid-partecipant
Get           | /stats                        | si                   |Admin
Get           | /visualizzaAsteByStato        | no                   | - 

## Descrizione delle rotte
In questa sezione vengono riportate tutte le rotte utilizzate nel progetto con le relative descrizioni.
Tutti i raw data inviati dall'utente vengono validati controllando i tipi ed eventuali altri tipi di errore (ad esempio data_inizio deve essere minore di data_fine).
### 1. /creaAsta
Rotta che permette la creazione di un'asta snap.
Alla creazione dell'asta lo stato passa automaticamente da "creata" a "aperta", inoltre viene lanciato un timer di 5 minuti, il quale se viene superato, 
controlla se è stato raggiunto il minimo numero di partecipanti.
In caso non venga raggiunto il limite minimo, l'asta passa allo stato "terminata", e gli utenti che si erano iscritti ricevono la loro quota di iscrizione.
Di seguito riportiamo un esempio di payload valido:
```bash
{
  "username_creator": "andrea_felicetti",
  "nome_oggetto": "smartphone",
  "min_partecipanti": 2,
  "max_partecipanti": 5,
  "quota_partecipazione": 5,
  "durata_asta_minuti": 1,
  "incremento_puntata": 5,
  "max_n_puntate_partecipante": 5,
  "max_prezzo_asta": 125
}
```
token JWT: 

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZV9jcmVhdG9yIjoiYW5kcmVhX2ZlbGljZXR0aSIsIm5vbWVfb2dnZXR0byI6InNtYXJ0cGhvbmUiLCJtaW5fcGFydGVjaXBhbnRpIjoyLCJtYXhfcGFydGVjaXBhbnRpIjo1LCJxdW90YV9wYXJ0ZWNpcGF6aW9uZSI6NSwiZHVyYXRhX2FzdGFfbWludXRpIjoxLCJpbmNyZW1lbnRvX3B1bnRhdGEiOjUsIm1heF9uX3B1bnRhdGVfcGFydGVjaXBhbnRlIjo1LCJtYXhfcHJlenpvX2FzdGEiOjEyNX0.ZNNWcK8esgy_6JTl8W0Rz3JvoMZdkxYZPuKxG4wfGhk
```

### 2. /partecipaAsta
Rotta che permette di partecipare ad un'asta esistente.
Per poter partecipare l'asta deve essere in stato "aperta".
I controlli applicati a questa rotta riguardano:
* l'esistenza dell'utente che si vuole iscrivere e il suo relativo ruolo;
* l'esistenza dell'asta a cui vuole partecipare;
* l'utente deve possedere abbastanza credito per poter partecipare all'asta;
* l'utente non deve essere già iscritto;
* il numero attuale dei partecipanti deve essere minore di quello massimo.

Una volta validata la possibilità di potersi iscrivere viene scalato all'utente il credito
della quantità pari al costo di iscrizione.

Ogni nuova partecipazione viene notificata all'Observer.
Quando il numero di partecipanti raggiunge il numero minimo viene attivato un timer
di durata pari a quella impostata dal creatore dell'asta.
L'asta quindi passa in stato di "rilancio" e gli utenti partecipanti possono effettuare i loro rilanci.


Di seguito riportiamo un esempio di payload valido:

```bash
{
  "username": "sam_leli",
  "id_asta": 1
}
```
token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbV9sZWxpIiwiaWRfYXN0YSI6MX0.m1Jg6vNtbM6JZviFr16sqp72T77m4K8KvGlb82bHFII
```

### 3. /rilancia
Rotta che permette ad un utente partecipante dell'asta di poter rilanciare della quota
definita come incremento dell'asta.
I controlli effettuati sono:
* l'esistenza dell'utente che vuole rilanciare;
* l'esistenza dell'asta a cui vuole rilanciare;
* l'asta deve essere nella fase di rilancio;
* l'utente deve essere già iscritto;
* l'utente non deve aver raggiunto il numero massimo di puntate;
* l'utente deve possedere abbastanza credito per poter rilanciare all'asta;

Terminato il timer descritto nel precendente punto avviene l'assegnazione del vincitore.
Si aggiudica l'asta l'utente che ha effettuato più rilanci.
In caso di parità si aggiudica l'asta chi ha rilanciato per ultimo.
Al termine viene scalato il credito all'utente vincitore e l'asta passa nello stato "terminata".


Di seguito riportiamo un esempio di payload valido:
```bash
{
  "username": "sam_leli",
  "id_asta": 1
}
```
token JWT: 
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbV9sZWxpIiwiaWRfYXN0YSI6MX0.m1Jg6vNtbM6JZviFr16sqp72T77m4K8KvGlb82bHFII

```

### 4. /ricaricaUtente
Rotta che permette ad un utente Admin di poter ricaricare un utente bid-partecipant.
Le verifiche effettuate per questa rotta sono:
* controllo sull'esistenza e ruolo dell'utente Admin;
* controllo sull'esistenza e ruolo dell'utente bid-partecipant da ricaricare;

Di seguito riportiamo un esempio di payload valido:
```bash
{
  "username_admin": "admin",
  "username_destinatario": "sam_leli",
  "quantita": 200
}
```
Token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZV9hZG1pbiI6ImFkbWluIiwidXNlcm5hbWVfZGVzdGluYXRhcmlvIjoic2FtX2xlbGkiLCJxdWFudGl0YSI6MjAwfQ.VJY54ZYYGvcUz3PaU5OxwE0bJlxxOk3kuZO-gfGQqRA
```

### 5. /verificaCreditoResidio
Rotta che permette ad un utente bid-partecipant di poter verificare il proprio credito residuo.
Il controllo effettuato su questa rotta è stato quello di verificare l'esistenze del ruolo bid-partecipant.

Di seguito un esmepio di payload valido:

```bash
{
  "username": "sam_leli"
}
```
Token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbV9sZWxpIn0.zYWBd7lBhdu2ApNkdofgbxKX3f-qwhWbf0sqSzh-NkI
```

### 6. /elencoRilanci
Rotta che permette di visualizzare al bid-creator e al bid-partecipant l'elenco dei rilanci.
I controlli effettuati sono:
* l'esistenza e il ruolo dell'utente;
* l'esistenza dell'asta;
* lo stato dell'asta nella fase di rilancio;
* se l'utente è bid-creator allora deve essere il creatore dell'asta;
* se l'utente è bid-partecipant allora deve essere un partecipante all'asta.

Di seguito riportiamo un esempio di payload valido (in questo caso bid-creator):
```bash
{
  "username": "andrea_felicetti",
  "id_asta": 1
}
```
Token JWT
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuZHJlYV9mZWxpY2V0dGkiLCJpZF9hc3RhIjoxfQ.TKpReZ9OvWkWpt8OKAmJYYd09k7DjHQ7zz10MXKiSwc
```

### 7. /storicoAste

Rotta che permette di visualizzare lo storico delle aste con il ruolo bid-partecipant.
Il controllo effettuato in questa rotta è stato quello di verificare se l'utente esiste ed ha il ruolo di bid-partecipant.

Di seguito riportiamo un esempio di payload valido:

```bash
{
  "username": "sam_leli"
}
```
Token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbV9sZWxpIn0.zYWBd7lBhdu2ApNkdofgbxKX3f-qwhWbf0sqSzh-NkI
```

### 8. /speseEffettuate
Rotta che permette di visualizzare tutte le spese effettuate durante le partecipazioni alle aste in un dato periodo con il ruolo bid-partecipant.
Il controllo effettuato in questa rotta è stato quello di verificare se l'utente esiste ed ha il ruolo di bid-partecipant.

Di seguito di riporta un esempio di payload valido:

```bash
{
  "username": "sam_leli",
  "data_inizio": "2022-06-24T01:00:00+01:00",
  "data_fine": "2022-07-07T17:00:00+01:00"
}
```

Token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNhbV9sZWxpIiwiZGF0YV9pbml6aW8iOiIyMDIyLTA2LTI0VDAxOjAwOjAwKzAxOjAwIiwiZGF0YV9maW5lIjoiMjAyMi0wNy0wN1QxNzowMDowMCswMTowMCJ9.wmnOrkFFvqN4ZOKEMX_e7YiCaoOwtDdZuzCRGudgkZs
```

### 9. /stats
Rotta per visualizzare le statistiche sulle aste in un dato periodo temporale.
La verifica che viene effettuata è sull'esistenza e sul ruolo di Admin dell'utente.

Di seguito si riporta un esempio di payload valido:
```bash
{
  "username": "admin",
  "data_inizio": "2022-06-24T01:00:00+01:00",
  "data_fine": "2022-07-07T17:00:00+01:00"
}
```

Token JWT:
```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZGF0YV9pbml6aW8iOiIyMDIyLTA2LTI0VDAxOjAwOjAwKzAxOjAwIiwiZGF0YV9maW5lIjoiMjAyMi0wNy0wN1QxNzowMDowMCswMTowMCJ9.YM3PBg8gzeVWgMC05Vv8wJAWnBy9I_N9iV9nnXCx0b8
```

### 10. /visualizzaAsteByStato
Rotta che permette di filtare le aste in base allo stato.
Questa rotta a differenza delle altre è pubblica quindi non occorre fare un'autenticazione JWT.

Gli stati validi per il filtraggio delle aste sono:
* creata
* aperta
* rilancio
* terminata

Esempio: localhost:8080/visualizzaAsteByStato?stato=aperta


## Progettazione - Diagrammi UML

Di seguito si riportano i diagrammi UML:

• Use Case Diagram 

![aste](https://user-images.githubusercontent.com/86314085/175765849-463664be-cc8a-47ab-9de6-d8237c0ded9a.jpg)

• Sequence Diagram

![sequence](https://user-images.githubusercontent.com/86314085/175775160-f989e8f5-1924-4c4a-8c5c-05eb680155ab.jpg)


## Progettazione - Pattern

**• Singleton** : Fa parte della famiglia dei pattern creazionali. 
Coinvolge una singola classe che è responsabile della creazione dell'oggetto assicurandosi che venga creato una sola volta. 
Fornisce un modo per accedere al suo unico oggetto, non ha necessità di creare un'istanza dell'oggetto della classe.

![image](https://user-images.githubusercontent.com/86314085/175776746-30f7efdc-38ac-4e0a-b36d-1f3a5f2b7f71.png)

Nel nostro caso è stato utilizzato per creare una sola connessione con il database.

**• Middleware** : Strato software che viene utilizzato per validare le richieste.
Nello specifico viene utilizzato per controllare se è presente nell'header il parametro authorization, per validare e controllare la presenza del token JWT, per validare i dati inviati dall'utente ed infine per gestire gli errori.


**• Observer** : Definisce un meccanismo per tenere traccia di diversi oggetti, riguardo gli eventi che succedono all'oggetto stesso. 

Abbiamo:

 * Publisher: oggetto principale che voglio osservare;
 * Subscriber: tutti gli oggetti di cui vogliamo tener traccia dei cambiamenti del Publisher.

L'Observer si usa quando il cambiamento di stato di un oggetto (Publisher) potrebbe richiedere cambiamenti anche agli altri (Subscriver).

I publisher e il subscriver comunicano attraverso l'interfaccia.

Nel nostro caso è stato utilizzato per attivare la fase di rilancio al verificarsi del raggiungimento del numero di iscritti minimo per quell'asta.
Inoltre è stato utilizzato anche per gestire la chiusura dell'asta, con l'assegnazione del vincitore.

![image](https://user-images.githubusercontent.com/86314085/175777233-9af5db7b-1767-4a8d-a978-ac9e895a5e6b.png)

**• Builder** : pattern creazionale. 
Crea passo dopo passo l'oggetto finale ed è indipendente da altri oggetti.
Abbiamo i costruttori che permettono, a partire da un oggetto della stessa classe, di andare a generare oggetti più complessi in base alle necessità.

Nel nostro caso è stato utilizzato questo pattern per creare la risposta HTTP da inviare all'utente.

![image](https://user-images.githubusercontent.com/86314085/175777426-318d3fa9-2218-4725-877a-a1b0d74e90ec.png)

**• Factory** : fa parte della famiglia dei pattern creazionali, ci consente di creare oggetti senza esporre la logica di creazione al client e ci riferiamo all'oggetto appena creato utilizzando un'interfaccia comune.
Tramite questo pattern si crea una famiglia di oggetti, incapsulando i comporamenti di interesse.
Abbiamo 4 classi:
 * Creator: contiene il factory method;
 * ConcreteCreator: fa ritornare l'oggetto; 
 * Product: definisce l'interfaccia;
 * ConcreateProduct: implementa l'oggetto definito da product.

Nel nostro progetto è stato utilizzato per costruire un logger in grado di scrivere su due tipi di file diversi, uno per gli errori e uno per le informazioni.

![image](https://user-images.githubusercontent.com/86314085/175777719-70892dff-2bc8-49d0-a20b-0bc55d6aa6ee.png)

## Avvio
All'avvio il servizio viene caricato con i seguenti utenti test:
Nome utente        | Credito caricato              | Ruolo
----------------   | ----------------------------- |------------------------------
sara_bianchi       | 0                             |bid-creator
andrea_felicetti   | 0                             |bid-creator
admin              | 0                             |Admin
adriano_mancini    | 1000                          |bid-partecipant
lucrezia_antenucci | 1000                          |bid-partecipant
sam_leli           | 1000                          |bid-partecipant
luca_rossi         | 1000                          |bid-partecipant
rita_bianchi       | 1000                          |bid-partecipant
xi_li              | 1000                          |bid-partecipant
petra96            | 1000                          |bid-partecipant
giulia_stracci     | 1000                          |bid-partecipant
simo_dirado        | 1000                          |bid-partecipant

**• Ambiente Docker installato sulla propria macchina**\
**• Clonare la seguente repository da terminale e spostarsi all'interno della cartella**
```bash
git clone https://github.com/LucreziAntenucci98/Progetto_Programmazione_Avanzata
```
**•Creare un file chiamato ".env" con questa struttura:** (sostituire 'secretkey' con la chiave con la quale verranno generati i token JWT) 
```bash
SECRET_KEY=secretkey
PGUSER=postgres
PGDATABASE=aste_snap
PGHOST=dbAsteSnap
PGPASSWORD=postgres
PGPORT=5432
```
**• Avviare Docker tramite il seguente comando:**
```bash
docker-compose up
```
**• Il servizio è accessibile sulla porta 8080 del localhost**


## Test
Per effettuare il Test del seguente progetto, abbiamo importato il file .json nella directory, che a sua volta dovrà essere importato all'interno dell'app Postman.
