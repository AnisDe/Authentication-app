import express from 'express';
import passport from 'passport';
import users from '../controllers/users.js';
// import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();
// router.use(arcjetProtection);
router.post('/register', users.register);

router.post('/login', passport.authenticate('local'), users.login);

router.delete('/logout', users.logout);

router.post('/forgot', users.forgot);

router.post("/resend-verification", users.resendVerification);

router.post('/reset/:token', users.PostResetToken);

router.put('/edit/me', users.editUser);

router.get('/verify-email/:token', users.verifyEmail);

router.get('/profile/me', users.profile);

router.get('/check-auth/', users.checkAuth);

router.get('/:token', users.GetResetToken);

router.delete('/delete/:id', users.DeleteUser);


export default router;
