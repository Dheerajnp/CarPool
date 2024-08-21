import { ChatRepository } from "../interfaces/repository/ChatRepository";
import { ChatIntercator } from "../interfaces/usecases/ChatInteractor";

export class chatInteractorImp implements ChatIntercator{
    constructor(private readonly repository: ChatRepository){}
}