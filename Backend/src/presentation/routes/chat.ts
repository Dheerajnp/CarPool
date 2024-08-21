import { Router } from 'express'
import { getChat } from '../middlewares/chatMiddleware';
// import { ChatRepositoryImp } from '../../application/repository/ChatRepositoryImp';
// import { chatInteractorImp } from '../../application/usecases/chatInteractor';

// import { chatController } from '../controllers/chatController';

// const repository =  new ChatRepositoryImp();
// const interactor = new chatInteractorImp(repository);
// const controller = new chatController(interactor);

const chatRouter:Router = Router();

chatRouter.get('/user/getChat/:userId',getChat)

export default chatRouter;