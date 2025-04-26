import express from 'express';
import { clientController } from '../../controllers';
import auth from '../../middleware/auth';
import validate from '../../middleware/validate';
import { ClientCreateSchema, ClientUpdateSchema } from '../../types/client.types';

const router = express.Router();
router.use(auth());

router.post('/', validate(ClientCreateSchema), clientController.createClient);

router.get('/', clientController.searchClients);
router.get('/statistics', clientController.getStatistics);
router.get('/:clientId', clientController.getClientProfile);

router.patch('/:clientId', validate(ClientUpdateSchema), clientController.updateClient);

router.delete('/:clientId', clientController.deleteClient);

export default router;
