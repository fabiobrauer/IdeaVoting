import express from 'express';
const router = express.Router();

import {register} from '../controllers/AuthController.js';
import {login} from '../controllers/AuthController.js';

router.post('/register', register);
router.post('/login', login);

export default router;