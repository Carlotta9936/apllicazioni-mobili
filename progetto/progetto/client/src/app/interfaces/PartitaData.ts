import { Partita } from "./Partita";

export interface PartitaData {
    pubblica: boolean,  //true: pubblica , false: privata
    iniziata: boolean,
    codice: any,
    numPartecipanti: number,
    proprietario: string,
    messaggi: string[],
    datiPartita: Partita,
}