import { Router } from 'express'
import { ChatRepositoryImp } from '../../application/repository/ChatRepositoryImp';
import { chatInteractorImp } from '../../application/usecases/chatInteractor';
import {authMiddleware} from '../middlewares/authMiddleware'
import { chatController } from '../controllers/chatController';

const repository =  new ChatRepositoryImp();
const interactor = new chatInteractorImp(repository);
const controller = new chatController(interactor);

const chatRouter:Router = Router();

//user chat routes
chatRouter.get('/user/getChat/:userId',authMiddleware,controller.getChat.bind(controller))
chatRouter.get('/user/getConversations/:Id',authMiddleware,controller.getConversations.bind(controller));
chatRouter.get('/user/getMessages/:roomId',controller.getMessages.bind(controller));
chatRouter.post('/:senderId',controller.sendMessage.bind(controller));

//driver chat routes


export default chatRouter;