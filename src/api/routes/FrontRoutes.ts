import { Router, Request, Response } from 'express'
import path from 'path'
import express from 'express'
import fs from 'fs'

const publicRoutes = Router()

publicRoutes.use('/static', express.static(path.join(__dirname, "../../public")));

const setupRoutes = (dirPath: string, baseUrl: string) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            setupRoutes(fullPath, `${baseUrl}/${file}`);
            return;
        }

        const isHtmlFile = stat.isFile() && path.extname(file) === '.html';
        if (!isHtmlFile) return;

        const routePath = file === 'index.html' 
            ? `${baseUrl === '' ? '/' : baseUrl}` 
            : `${baseUrl}/${path.basename(file, '.html')}`;

        publicRoutes.get(routePath, (req: Request, res: Response) => {
            res.sendFile(fullPath);
        });
    });
};



const viewsDir = path.join(__dirname, '../../views')
setupRoutes(viewsDir, "")

export default publicRoutes;