import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

router.get('/songs-in-multiple-playlists', AnalysisController.findSongsInMultiplePlaylists);
router.get('/library-stats', AnalysisController.getLibraryStats);
router.get('/duplicates', AnalysisController.findDuplicates);
router.get('/most-common-artists', AnalysisController.getMostCommonArtists);

export default router;
