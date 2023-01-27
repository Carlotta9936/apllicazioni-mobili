export interface User {
    username: string;
    password: string;
    nome: string;
    cognome: string;
    mail: string;
    crediti: number;
    timbri: number;
    codiceTimbri: number;
    stats: {
        partiteFatte: number;
        bingo: number;
        cinquine: number;
        superbingo: number;
        maxVincita: number;
    }
}