export interface Casella {
    numero: number | undefined;
    stato: "vuota" | "numero" | "estratta" | "segnata";
}