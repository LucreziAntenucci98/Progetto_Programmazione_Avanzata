# Progetto-Programmazione-Avanazata 

## Team

**• Antenucci Lucrezia** \
**• Leli Samuele**

## Obiettivo del Progetto

L'obiettivo del progetto è stato quello di realizzare un servizio di back-end utilizzando dei framework specifici, che consenta la gestione delle aste online chiamate Aste Snap.
In particolare il sistema prevede la possibilità di:

-Creazione di una nuova Asta \
-Visualizzare l'elenco delle asta, filtrando per stato (creata,aperta,rilancio,terminata) \
-Partecipazione ad un'astra mediante autenticazione bid-partecipant e deve essere aperta \
-Rilancio con ruolo bid-creator \
-Visualizzare l'elenco dei rilanci per un'asta alla quale si sta partecipando e si è nella fase di rilancio \
-Gestione del "wallet" degli utenti \
-Gestione dell'iscrizione \
-Gestione del caso in cui non si raggiunge il numero di partecipanti \
-Gestione del credito(somma dei costi di iscrizione + prezzo massimo asta), con eventuale rifiuto(bid-partecipant) \
-Visualizzazione del proprio credito residuo \
-Creazione di una rotta per ricaricare l'utente \
-Dopo essersi aggiudicati l'asta , viene scalato il credito \
-Visualizzazione dello storico delle aste (aggiudicate e non) \
-Visualizzare la spesa effettuata in un dato periodo temporale a seguito delle eventuali aggiudicazioni intercorse oltre che alle quote di iscrizioni effettivamente scalate \
-Fornire delle statistiche attraverso le quali in un dato intervallo temporale è necessario fornire i seguenti dettagli: 

  -n° di aste completate con successo;
  
  -n° aste terminate per non aver raggiunto il numero minimo di iscritti;
  
  -Media del rapporto tra numero di puntate effettuate e numero massimo di puntate effettuabili .


Ogni azione corrisponde a una differente richiesta HTTP (GET o POST) che deve essere, o meno, autenticata tramite token JWT.

## Strumenti Utilizzati 

* [VisuaStudio Code](https://code.visualstudio.com/)
* [Docker](https://docs.docker.com/)

## Librerie

**•	Node.JS** \
**•	Express** \
**•	Sequelize** \
**•	Postgres**


## Richieste
Tipo          | Rotta                         | Token
------------- | ----------------------------- |---------
Post          | /creaAsta                     |
Post          | /partecipaAsta                |
Post          | /rilancia                     |
Post          | /ricaricaUtente               |
Get           | /verificaCreditoResidio       |
Get           | /elencoRilanci                |
Get           | /storicoAste                  |
Get           | /speseEffettuate              |
Get           | /stats                        | 

## Eventi



## Progettazione - Diagrammi UML

## Progettazione - Pattern
**• factory** \
**• observable** \
**• singleton** \
**• builder** \
**• middleware**

## Avvio

## Test






