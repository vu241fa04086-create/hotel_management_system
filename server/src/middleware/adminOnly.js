import jwt from 'jsonwebtoken';
export function adminOnly(req,res,next){ const header=req.headers.authorization||''; const token=header.startsWith('Bearer ')?header.slice(7):''; try { if(!token) throw Error(); req.admin=jwt.verify(token,process.env.JWT_SECRET||'dev-only-harborlight-secret-change-before-deployment'); next(); } catch { res.status(401).json({message:'Admin sign-in required'}); } }

