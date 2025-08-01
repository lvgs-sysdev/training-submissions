import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    registerUser,
    loginUser,
    checkAuthStatus,
    logoutUser,
    getRecommendedUsers,
    getUserProfile,
    checkDuplicateUserId,
    updateUserProfile
} from '../controllers/userController';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth/status', checkAuthStatus);
router.post('/auth/logout', logoutUser);
router.get('/recommendations', getRecommendedUsers);
router.get('/profile/:id', getUserProfile);
router.post('/check-duplicate', checkDuplicateUserId);
router.post(
    '/profile/update',
    upload.fields([
        { name: 'bannerImage', maxCount: 1 },
        { name: 'avatarImage', maxCount: 1 },
    ]),
    updateUserProfile
);

export default router;
