import { Router } from 'express';
import {
  getHealth,
  getOrgans,
  getOrganById,
  getOrganParts,
  getOrganDiseases,
  getDiseases,
  getDiseaseById,
  searchAnatomy,
  getQuizzes,
  exportProjectZip,
} from '../controllers/anatomyController';

const router = Router();

router.get('/health', getHealth);
router.get('/organs', getOrgans);
router.get('/organs/:id', getOrganById);
router.get('/organs/:id/parts', getOrganParts);
router.get('/organs/:id/diseases', getOrganDiseases);
router.get('/diseases', getDiseases);
router.get('/diseases/:id', getDiseaseById);
router.get('/search', searchAnatomy);
router.get('/quizzes', getQuizzes);
router.get('/export-zip', exportProjectZip);

export default router;
