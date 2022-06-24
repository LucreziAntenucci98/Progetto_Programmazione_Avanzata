import * as AstaClass from "../models/Asta";
import { Partecipazione } from "../models/Partecipazione";
import { Puntata } from "../models/Puntata";
import { User } from "../models/User";
interface IAsta {
    //attaccare all'observ un argomento.
    attach(observer: Observer): void;

    // togliere l'observer
    detach(observer: Observer): void;

    // notifica all'observer tutti gli eventi
    notify(): void;
}

export class OBAsta implements IAsta {
    /**
     * @type {number} variabile di stato
     */
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

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    /**
     * Viene notificato a tutti gli observer che quello stato è cambiato
     */
    public notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
    public AggiuntaPartecipante(): void {
        console.log('\nSubject: I\'m doing something important.');
        this.num_partecipanti += 1;

        console.log(`Subject: My state has just changed to: ${this.num_partecipanti}`);
        this.notify();
    }

}
/**
 * L'interfaccia dichiare l'aggiornamento del metodo
 */
 interface Observer {
    // Receive update from subject.
    update(subject: IAsta): void;
}

/**
 * L'observer reagisce all'evento che si è appena verificato
 */
export class RaggiungimentoPartecipanti implements Observer {
    public update(subject: IAsta ): void {
        if (subject instanceof OBAsta && subject.num_partecipanti === subject.min_num_partecipanti) {
            console.log('ConcreteObserverA: Reacted to the event.');
        
            AstaClass.Asta.update(
                {stato: "rilancio"},
                {where:{"id_asta": subject.id_asta} }
            ).then((asta:any) => {
                setTimeout(async () => {
                    console.log("ASTA "+subject.id_asta + " CHIUSA");
                    await AstaClass.Asta.update({stato: "terminata"},{where:{"id_asta": subject.id_asta} });
                    assegnaVincitore(subject.id_asta)
                }, subject.minuti_asta*1000*60);
            });
            const assegnaVincitore:any  = async (id_asta:number):Promise<any> => {
                let partecipazioni:Array<any>= await Partecipazione.findAll({
                    raw: true,
                    where: {
                        "id_asta": id_asta
                    },
                });
                //chi ha fatto piu puntate?
                console.log(partecipazioni);
                const contatore_puntateList:number[] = partecipazioni.map(obj => obj.contatore_puntate)
                const maxValue:number = Math.max(...contatore_puntateList);
                console.log(maxValue);
                const partecipazione_filter:any[] = partecipazioni.filter(obj => obj.contatore_puntate === maxValue);
                console.log(partecipazione_filter);
                if(partecipazione_filter.length === 1)  operazioniVincitore(partecipazione_filter[0].username,id_asta)
                else{
                    //in caso di parità chi ha puntato per ultimo vince
                    const usernameList:string[] = partecipazione_filter.map(part => part.username);
                    console.log(usernameList);
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
                    const username_vincitore = puntate[0].username;
                    operazioniVincitore(username_vincitore,id_asta)
                        
                }
            };
        
            const operazioniVincitore = async (username:string,id_asta:number):Promise<void> => {
                //calcolare la spesa
                console.log("Il vincitore è: "+username);
                const asta = await AstaClass.Asta.findByPk(id_asta,{raw:true});
                
                const { count, rows } = await Puntata.findAndCountAll({
                    where: {
                      id_asta: id_asta
                    },
                });
                const prezzo_asta:number = count * asta.incremento_puntata;
                //UPDATE ASTA username_vincitore, tot_prezzo_aggiudicato
                await AstaClass.Asta.update(
                    {
                        username_vincitore: username,
                        tot_prezzo_aggiudicato: prezzo_asta
                    },
                    {
                        where:{"id_asta": subject.id_asta} 
                    }
                );

                //UPDATE PARTECIPAZIONE spesa_partecipazione, asta_vinta
                await Partecipazione.increment(['spesa_partecipazione'],{by: prezzo_asta,where:{username: username,id_asta:id_asta}});
                await Partecipazione.update({asta_vinta: true},{where:{"id_asta": subject.id_asta,"username":username}});

                //UPDATE USER credito

                await User.decrement(['credito'],{by: prezzo_asta,where:{username: username}});


            }   
        }
    }

}