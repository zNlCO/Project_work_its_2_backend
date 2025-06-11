export interface Prenotazione {
    id: string;
    idUser: string;
    bikes: [{
        id: string;
        quantity: number;
        accessori: [String];
        assicurazione: String
    }];
    start: Date;
    stop: Date;
    pickupLocation: string;
    dropLocation: string;
    manutenzione: boolean;
    cancelled: boolean;
    status: String;
}