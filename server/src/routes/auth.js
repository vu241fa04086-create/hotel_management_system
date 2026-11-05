import { Router } from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken';
const router=Router();
router.post('/login',async(req,res)=>{ const {email,password}=req.body||{}; const validEmail=String(email||'').toLowerCase()===String(process.env.ADMIN_EMAIL||'admin@harborlight.local').toLowerCase(); const validPass=await bcrypt.compare(String(password||''),await bcrypt.hash(process.env.ADMIN_PASSWORD||'ChangeMe123!',10)); if(!validEmail||!validPass) return res.status(401).json({message:'Email or password is incorrect'}); res.json({token:jwt.sign({role:'admin',email},(process.env.JWT_SECRET||'dev-only-harborlight-secret-change-before-deployment'),{expiresIn:'8h'}),email}); });
export default router;

