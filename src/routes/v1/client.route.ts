import express from 'express';
import { clientController } from '../../controllers';

const router = express.Router();

router.post('/', clientController.createClient);

router.get('/', clientController.searchClients);

router.get('/:clientId', clientController.getClientProfile);

router.patch('/:clientId', clientController.updateClient);

router.delete('/:clientId', clientController.deleteClient);

export default router;
