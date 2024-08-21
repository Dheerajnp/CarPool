import { ChatIntercator } from "../../application/interfaces/usecases/ChatInteractor";

export class chatController{
    constructor(private readonly interactor:ChatIntercator){}
}