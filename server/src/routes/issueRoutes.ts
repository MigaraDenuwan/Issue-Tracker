import { Router } from 'express';
import * as issueController from '../controllers/issueController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', issueController.createIssue);
router.get('/', issueController.getIssues);
router.get('/stats', issueController.getStats);
router.get('/:id', issueController.getIssueById);
router.put('/:id', issueController.updateIssue);
router.delete('/:id', issueController.deleteIssue);
router.patch('/:id/status', issueController.updateStatus);

export default router;
