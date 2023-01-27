import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneratoreCartellaService {

  constructor() { }


  //Get numeri zero compresi
  getNumeri(): any{
    return this.getNumeriCasuali();
  }

  //Estrazione dei numeri
  getNumeriCasuali(): number[]{
    let numeri: number[] = [Math.floor(Math.random() * (90) + 1)]; //L'array deve partire già con un numero in memoria
    for(let i=0; i<14; i++){
      let n = Math.floor(Math.random() * 90 + 1);
      if(this.controlloPresenza(numeri, n) && this.controlloDecina(numeri, n) < 3){
        numeri.push(n);
      } else {
        console.log("BLOKKA", n)
        i--;
      }
    }
    return this.ordinaNumeri(numeri);
  }
  
  //Controlli per nuovo numero
  //Controllo presenza
  controlloPresenza(numeri: number[], numero: number): Boolean {
    let controllo: boolean = true;
    numeri.forEach((n: number) => {
      if(n === numero){
        controllo = false;
      }
    });
    return controllo;
  }

  
  //Controllo decina, non ci possono essere più di 3 numeri con la stessa decina
  //Restituisce i la quantità di altri numeri con la stessa decina
  controlloDecina(numeri: number[], numero: number): number {
    if(numero === 90){  //Dato che il 90 va nella riga dell'80 
      numero-=1;        //lo trattiamo come se fosse un 89
    }
    //i limiti sono il più grande e il più piccolo numero con quella decina
    // 65 limiteInf = 60 limiteSup = 69
    let limiteInf: number = Math.floor(numero/10)*10;
    let limiteSup: number = Math.floor(numero/10)*10+9;
    let count: number = 0;
    numeri.forEach((n: number) => {
      if(n === 90){
        n--;
      }
      if(n >= limiteInf && n <= limiteSup){
        count++;
      }
    })
    return count;
  }
  
  //Ordino i numeri
  ordinaNumeri(numeri: number[]): number[] {
    let numeriOrdinati: number[] = [];
    for(let i=0; i<15 ; i++){
      let indexMinore = 0
      let minore = numeri[indexMinore];
      numeri.forEach((n: number, index: number) => {
        if(n<minore){
          minore = n;
          indexMinore = index;
        }
      })
      
      numeriOrdinati.push(minore);
      numeri.splice(indexMinore, 1);
    }
    
    console.log("N", numeriOrdinati);
    return numeriOrdinati;
  }

  //Aggiungi gli zeri
  aggiungiCaselleVuote(numeri: number[]): number[]{
    let indexNumeri = 0;
    let count = 3;
    let numeriConZero: number[] = [];
    //Scorro tutti i numeri
    numeri.forEach((n:number, index: number) => {
      if(n===90){    //Se è 90 lo aggiungiamo, sicuramente è l'ultimo numero
        numeriConZero.push(90);
      } else {
        //Controllo se sto guardando un altra decina (indexNumeri)
        if(Math.floor(n/10) !== indexNumeri){
            let zeri = count + (3 * (Math.floor(n/10) - indexNumeri - 1))
            for(let i=zeri; i>=1; i--){
              numeriConZero.push(0);
            }
            numeriConZero.push(n);
            indexNumeri = Math.floor(n/10);
            count=2;
        } else {
          numeriConZero.push(n);
          count--;
        }
      }
    })
    
    //Aggiunta zeri finali
    if(numeriConZero.length !== 27){
      let zeriFinali = 27 - numeriConZero.length;
      for(let i = 0; i < zeriFinali; i++){
        numeriConZero.push(0)
      }
    }
    return numeriConZero;
  } 


  //Transforma array in matrice
  transformaMatrice(numeri: number[]): number[][] {
    let matrice: number[][] = [];
    matrice[0] = []
    matrice[1] = []
    matrice[2] = []

    let index: number = 0;
    //Sistemo tutti i numeri in una matrice 9x3, che è la grandezza della cartella
    for(let j = 0; j < 9; j++){
      for(let i = 0; i < 3; i++){
        matrice[i][j] = numeri[index];
        index++;
      }
    }

    return matrice;
  }

  //Transforma matrice in array
  transformaArray(matrice: number[][]): number[]{
    let numeri: number[] = [];
    for(let j = 0; j < 9; j++){
      for(let i = 0; i < 3; i++){
        numeri.push(matrice[i][j]);
      }
    }
    return numeri;
  }

  //Sistema le caselle bianche
  sistemaBianche(matrice: number[][]): number[][] {
    //Sistemo la seconda riga, per gli umani è la terza
    let contaBianche = 0;
    let colonne: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    //Controllo quanti zeri ha l'ultima riga
    contaBianche = this.contaBianche(matrice[2]);

  /*
    * Sistemo l'ultima riga, facendo in modo che abbia 4 caselle bianche (e di conseguenza 5 con numero)
    * Estraggo un numero a caso che è la riga su cui andiamo a lavorare, se l'ultima riga a quall'indice
    * ha zero proviamo a scambiarlo con il numero della riga sopra (matrice[1]), se anche quello è zero proviamo 
    * con la prima, se anche quella è vuota aggiungiamo un giro al for, perché questo è andato a vuoto
  */    
    for(let i = contaBianche; i > 4; i--){
      let index = Math.floor(Math.random() * (colonne.length));
      console.log(index, colonne, colonne[index]);
      if(matrice[2][colonne[index]] === 0){
        if(matrice[1][colonne[index]] !== 0){
          matrice[2][colonne[index]] = matrice[1][colonne[index]];
          matrice[1][colonne[index]] = 0
          colonne.splice(index, 1)
        } else if(matrice[0][colonne[index]] !== 0) {
          matrice[2][colonne[index]] = matrice[0][colonne[index]];
          matrice[0][colonne[index]] = 0
          colonne.splice(index, 1)
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    //Sistemo la riga al centro, matrice[1]
    contaBianche = this.contaBianche(matrice[1]);
    colonne = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    for(let i = contaBianche; i > 4; i--){
      let index = Math.floor(Math.random() * (colonne.length));
      if(matrice[1][colonne[index]] === 0){
        if(matrice[0][colonne[index]] !== 0) {
          matrice[1][colonne[index]] = matrice[0][colonne[index]];
          matrice[0][colonne[index]] = 0
          colonne.splice(index, 1)
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    return matrice;
  }

  //Conteggio delle caselle bianche
  contaBianche(riga: number[]): number {
    let bianche = 0;
    riga.forEach((n: number) => {
      if(n === 0){
        bianche++;
      }
    })

    return bianche;
  }

  //Estrazione cinquine
  estrazioneCinquine(riga: number[]): number[] {
    let cinquina: number[] = [];
    riga.forEach((n: number) => {
      if(n!==0){
        cinquina.push(n);
      }
    })
    return cinquina;
  }

  //Get Cartelle
  getCartella(): any {
    let numeri: number[] = this.getNumeri();
    let matrice = this.sistemaBianche(this.transformaMatrice(this.aggiungiCaselleVuote(numeri)));
    //Ritorna tutti i numeri per la cartella, i numeri senza gli zeri per il bingo, e le tre cinquine
    return [this.transformaArray(matrice), numeri, this.estrazioneCinquine(matrice[0]), this.estrazioneCinquine(matrice[1]), this.estrazioneCinquine(matrice[2])];
  }

}
