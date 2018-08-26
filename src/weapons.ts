export class WeaponsInventory {

    weapon:number;
    selectedWeapon:any;
    weapons: any[] = [
       {
            name: 'Rifle',
            frequency: 200,
            count: 1,
            speed: 9,
            r:2,
            color:'black',
            ttl: 1000,
            explode: 0,
            spread: 0.1,
            damage: 5,
            // destroy: false,
            available:false
        },  {
            name: 'Shotgun',
            frequency: 800,     // // 200 è la frequenza di sparo = 5 colpi al sec
            count: 6,           // NUMERO DI PARTICELLE PER OGNI COLPO
            speed: 7,           // VELOCITA'
            r:2,
            color:'#800000',
            ttl: 1000,            // VITA (DURATA DEL COLPO)
            explode: 0,         // SE CREA UNA ESPLOSIONE
            spread: 0.5,        // QUANTO SI ALLARGA
            damage: 10,          // DANNO INFLITTO
            // destroy: false,     // SE DISTRUGGE
            available:false,    // SE L'ARMA E' DISPONIBILE
            shotNumber:100      // numero di colpi
        }, {
            name: 'Flamer',
            frequency: 20,
            count: 1,
            speed: 6,
            r:4,
            color:'#FFA500',
            ttl: 500,
            explode: 0,
            spread: 1.5,
            damage: 1.5,
            //destroy: false,
            available:false
        }, {
            name: 'Plasma',
            frequency: 150,
            count: 1,
            speed: 10,
            r:3,
            color:'blue',
            ttl: 1400,
            explode: 0,
            spread: 0.01,
            damage: 3,
            // destroy: false,
            available:false
        }, {
            name: 'Rocket',
            frequency: 1000,
            count: 1,
            speed: 8,
            r:4,
            color:'red',
            ttl: 1500,
            explode: 1,
            spread: 0.01,
            damage: 65,
            //destroy: true,
            available:false
        }, {
            name: 'Railgun',
            frequency: 2000,
            count: 1,
            speed: 16,
            r:3,
            color:'green',
            ttl: 1500,
            explode: 0,
            spread: 0.01,
            damage: 110,
            //destroy: false,
            available:false
        }];
    
    constructor(){
        this.weapon = 0;
        this.selectedWeapon = this.weapons[this.weapon];
    }

}