import * as AstaClass from "../models/Asta";
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
    constructor(id_asta: number ,min_num_partecipanti: number){
        this.id_asta = id_asta;
        this.min_num_partecipanti = min_num_partecipanti;
        this.num_partecipanti = 0;
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
                )
                .then(function() {
                    console.log("Asta in fase di rilancio")
                });
                
               
        }
    }
}
