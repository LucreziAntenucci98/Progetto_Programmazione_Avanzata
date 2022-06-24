import * as AstaClass from "../models/Asta";
import { Partecipazione } from "../models/Partecipazione";
import { Puntata } from "../models/Puntata";
import { User } from "../models/User";

/**
  * Interfaccia che identifica i metodi che il subject deve implementare
  */
interface IAsta {
    //attaccare all'observer un argomento.
    attach(observer: Observer): void;

    // elimina l'observer
    detach(observer: Observer): void;

    // notifica all'observer tutti gli eventi
    notify(): void;
}


 /**
  * Classe che serve a identificare l'oggetto di cui vogliamo osservare
  * il cambiamento di stato (subject)
  */
export class OBAsta implements IAsta {

    public num_partecipanti: number;
    public min_num_partecipanti:number;
    public id_asta : number ;
    public minuti_asta : number;
    constructor(id_asta: number ,min_num_partecipanti: number,minuti_asta:number){
        this.id_asta = id_asta;
        this.min_num_partecipanti = min_num_partecipanti;
        this.num_partecipanti = 0;
        this.minuti_asta = minuti_asta;
    }

    /**
     * @type {Observer[]} lista dei subscribers. 
     */
    private observers: Observer[] = [];

    /**
     * Implementiamo l'interfaccia e inseriamo l'observer al subject
     */
    public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    /**
     * Implementiamo l'interfaccia e eliminiamo l'observer dal subject
     */
    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('L\'asta non esiste');
        }

        this.observers.splice(observerIndex, 1);
    }

    /**
     * Implementazione del metodo per notificare a tutti gli observer che quello stato è cambiato
     */
    public notify(): void {
        console.log('Invio notifica agli observer');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    /**
     * Metodo utilizzato per notificare agli observer l'aggiunta di un nuovo
     * partecipante all'asta
     */
    public AggiuntaPartecipante(): void {
        console.log("Il numero dei partecipanti dell\'asta " + this.id_asta +" è aumentato di 1");
        this.num_partecipanti += 1;

        console.log(`L'attuale numero di partecipanti all'asta ${this.id_asta } è: ${this.num_partecipanti}`);
        this.notify();
    }

}
/**
 * Interfaccia per dichiare l'aggiornamento del metodo
 */
 interface Observer {
    // Metodo per ricevere gli aggiornamenti dal subject
    update(subject: IAsta): void;
}

/**
 * Classe che rappresenta l'observer, esso contiene l'evento che ci si aspetta che si verifichi.
 * Serve per osservare il raggiungimento del numero di partecipanti minimo.
 */
export class RaggiungimentoPartecipanti implements Observer {
    public update(subject: IAsta ): void {
        if (subject instanceof OBAsta && subject.num_partecipanti === subject.min_num_partecipanti) {
            console.log('ConcreteObserverA: Reacted to the event.');
            
            //viene aggiornato lo stato dell'asta a "rilancio"
            //da questo momento quindi i partecipanti possono rilanciare
            AstaClass.Asta.update(
                {stato: "rilancio"},
                {where:{"id_asta": subject.id_asta} }
            ).then((asta:any) => {
                //Viene settato un timer pari ai minuti definiti nell'asta
                //in cui gli utenti possono rilanciare
                setTimeout(async () => {
                    //al termine del timer, l'asta viene chiusa (stato: terminata), quindi nessun partecipante
                    //potrà rilanciare. Inoltre viene richiamato il metodo assegnaVincitore.
                    console.log("ASTA "+subject.id_asta + " CHIUSA");
                    await AstaClass.Asta.update({stato: "terminata"},{where:{"id_asta": subject.id_asta} });
                    assegnaVincitore(subject.id_asta)
                }, subject.minuti_asta*1000*60);
            });

            /**
             * Funcione utilizzata per trovare il vicitore, i criteri sono:
             * - vince chi ha fatto più rilanci
             * - in caso di pareggio, vince chi ha rilanciato per ultimo 
             * @param id_asta L'id dell'asta che è terminata e di cui si vuole trovare il vincitore
             */
            const assegnaVincitore:any  = async (id_asta:number):Promise<any> => {
                let partecipazioni:Array<any>= await Partecipazione.findAll({
                    raw: true,
                    where: {
                        "id_asta": id_asta
                    },
                });
                //Calcolo del numero di rilanci massimo
                const contatore_puntateList:number[] = partecipazioni.map(obj => obj.contatore_puntate)
                const maxValue:number = Math.max(...contatore_puntateList);
                //ottengo i partecipanti che hanno effettuato più puntate
                const partecipazione_filter:any[] = partecipazioni.filter(obj => obj.contatore_puntate === maxValue);
                //se la lunghezza è 1, significa che solo un partecipante ha fatto più rilanci, quindi è lui il vincitore
                if(partecipazione_filter.length === 1)  operazioniVincitore(partecipazione_filter[0].username,id_asta)
                else{
                    //in caso di parità chi ha puntato per ultimo vince
                    //viene ottenuta la lista degli username dei partecipanti che hanno effettuato più puntate
                    const usernameList:string[] = partecipazione_filter.map(part => part.username);
                    //vengono prese le puntate effettuate dai partecipanti
                    //ordinate per data in ordine discendente
                    const puntate = await Puntata.findAll({
                        where: {
                            username:usernameList,
                            id_asta: id_asta
                        },
                        order: [
                            ['time_ultimo_rilancio', 'DESC']
                        ],
                    }).then((puntate:any)=>{
                       return puntate;     
                    });
                    //il vincitore è il primo della lista
                    const username_vincitore = puntate[0].username;
                    //a questo punto bisogna effettuare delle operazioni sull'utente vincitore,
                    //sull'asta, e sulle partecipazioni
                    operazioniVincitore(username_vincitore,id_asta)
                        
                }
            };
            /**
             * Funzione che permette di eseguire le operazioni finali a seguito dell'assegnazione
             * della vincita
             * @param username Username del vincitore
             * @param id_asta id dell'asta che l'utente ha vinto
             */
            const operazioniVincitore = async (username:string,id_asta:number):Promise<void> => {
                //calcolare la spesa
                console.log("IL VINCITORE DELL'ASTA " + id_asta + " è: " + username);
                //ottengo l'asta
                const asta = await AstaClass.Asta.findByPk(id_asta,{raw:true});
                //conto il numero delle puntate per calcolare il prezzo finale dell'asta
                const { count, rows } = await Puntata.findAndCountAll({
                    where: {
                      id_asta: id_asta
                    },
                });
                //calcolo del prezzo dell'asta come il prodotto tra il numero delle puntate
                //e l'incremento dell'asta
                const prezzo_asta:number = count * asta.incremento_puntata;
                
                //UPDATE ASTA username_vincitore, tot_prezzo_aggiudicato e il numero delle puntate totali
                await AstaClass.Asta.update(
                    {
                        username_vincitore: username,
                        tot_prezzo_aggiudicato: prezzo_asta,
                        num_puntate_totali:count
                    },
                    {
                        where:{"id_asta": subject.id_asta} 
                    }
                );

                //UPDATE PARTECIPAZIONE spesa_partecipazione, asta_vinta
                await Partecipazione.increment(['spesa_partecipazione'],{by: prezzo_asta,where:{username: username,id_asta:id_asta}});
                await Partecipazione.update({asta_vinta: true},{where:{"id_asta": subject.id_asta,"username":username}});

                //UPDATE USER credito. Scalamento del credito all'utente pari all'importo finale
                //di chiusura d'asta

                await User.decrement(['credito'],{by: prezzo_asta,where:{username: username}});


            }   
        }
    }

}