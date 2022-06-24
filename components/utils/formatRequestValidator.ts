export const validateRawDataAsta = (asta:any):boolean => {
    /*
    INSERT
    --DA VALIDARE--
    username_creator;
    nome_oggetto;
    min_partecipanti;
    max_partecipanti;
    quota_partecipanti;
    durata_asta_minuti;
    incremento_puntata;
    max_n_puntate_partecipante;
    max_prezzo_asta;
    --NON DA VALIDARE--
    stato -> aperta;
    username_vincitore -> "";
    tot_prezzo_agg -> 0;
    num_attuale_partecipanti -> 0;
    */
    return (typeof asta.username_creator == "string" &&
    typeof asta.nome_oggetto == "string" &&
    (Number.isInteger(asta.min_partecipanti) && asta.min_partecipanti>0 ) &&
    (Number.isInteger(asta.max_partecipanti) && asta.max_partecipanti>0 ) &&
    (Number.isInteger(asta.quota_partecipazione) && asta.quota_partecipazione>0 ) &&
    (!isNaN(parseFloat(asta.durata_asta_minuti)) && asta.durata_asta_minuti>0 ) &&
    (Number.isInteger(asta.incremento_puntata) && asta.incremento_puntata>0 ) &&
    (Number.isInteger(asta.max_n_puntate_partecipante) && asta.max_n_puntate_partecipante>0 ) &&
    (Number.isInteger(asta.max_prezzo_asta) && asta.max_prezzo_asta>0 ) &&
    (asta.min_partecipanti<=asta.max_partecipanti));
};

export const validateRawDataPartecipazione = (partecipazione:any) => {
    /*
    INSERT
    --DA VALIDARE--
    username;
    id_asta;
    --NON DA VALIDARE--
    spesa_partecipazione -> 0;
    contatore_puntate -> 0;
    vincitore_asta -> False;
    */
    return (typeof partecipazione.username == "string" &&
    (Number.isInteger(partecipazione.id_asta) && 
    partecipazione.id_asta>0 ));   
};


export const validateRawDataRicaricaCredito = (ricarica:any) => {
    /*
    UPDATE
    --DA VALIDARE--
    username_admin;
    username_destinatario;
    quantita;
    */ 
    return (typeof ricarica.username_admin == "string" &&
    typeof ricarica.username_destinatario == "string" &&
    (Number.isInteger(ricarica.quantita) && 
    ricarica.quantita>0 ));   
};

export const validateRawDataElencoRilanci = (data:any) => {
    /*
    GET ELENCO RILANCI
    --DA VALIDARE--
    username;
    id_asta;
    */ 
    return (typeof data.username == "string" &&
    (Number.isInteger(data.id_asta) && 
    data.id_asta>0 ));   
};

export const validateRawDataAstFilter = (data:any) =>{
    /*
    --DA VALIDARE--
    stato
    */
    return (typeof data.stato == "string" && 
    (data.stato === "creata" ||
    data.stato === "aperta" ||
    data.stato === "rilancio" ||
    data.stato === "terminata"));   
}

export const validateRawTimeStampFilter = (data:any) =>{
    /*
    --DA VALIDARE--
    data_inizio
    data_fine
    */
    const check = new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    return (typeof data.username == "string" &&
     (check.test(data.data_inizio) && Date.parse(data.data_inizio)) &&
     (check.test(data.data_fine) && Date.parse(data.data_fine)) && 
     Date.parse(data.data_inizio) <= Date.parse(data.data_fine) );
}