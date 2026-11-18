import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { ORGANS_DATA, DISEASES_DATA, QUIZZES_DATA } from '../data/index';
import type { SearchResults } from '../../src/types/anatomy';

export function getHealth(_req: Request, res: Response) {
  res.json({
    status: 'ok',
    service: 'Human Anatomy Explorer API',
    timestamp: new Date().toISOString(),
    organsCount: ORGANS_DATA.length,
    diseasesCount: DISEASES_DATA.length,
    quizzesCount: QUIZZES_DATA.length,
  });
}

export function getOrgans(req: Request, res: Response) {
  const category = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
  const list = category && category !== 'all'
    ? ORGANS_DATA.filter((o) => o.category === category)
    : ORGANS_DATA;

  res.json({
    organs: list,
    total: list.length,
  });
}

export function getOrganById(req: Request, res: Response) {
  const organ = ORGANS_DATA.find((o) => o.id === req.params.id);
  if (!organ) {
    res.status(404).json({ error: `Organ '${req.params.id}' not found` });
    return;
  }
  res.json({ organ });
}

export function getOrganParts(req: Request, res: Response) {
  const organ = ORGANS_DATA.find((o) => o.id === req.params.id);
  if (!organ) {
    res.status(404).json({ error: `Organ '${req.params.id}' not found` });
    return;
  }
  res.json({
    organId: organ.id,
    organName: organ.name,
    parts: organ.parts,
    total: organ.parts.length,
  });
}

export function getOrganDiseases(req: Request, res: Response) {
  const organ = ORGANS_DATA.find((o) => o.id === req.params.id);
  if (!organ) {
    res.status(404).json({ error: `Organ '${req.params.id}' not found` });
    return;
  }
  const diseases = DISEASES_DATA.filter((d) => d.organId === organ.id);
  res.json({
    organId: organ.id,
    organName: organ.name,
    diseases,
    total: diseases.length,
  });
}

export function getDiseases(req: Request, res: Response) {
  const organId = typeof req.query.organId === 'string' ? req.query.organId.trim() : '';
  const list = organId && organId !== 'all'
    ? DISEASES_DATA.filter((d) => d.organId === organId)
    : DISEASES_DATA;
  res.json({
    diseases: list,
    total: list.length,
  });
}

export function getDiseaseById(req: Request, res: Response) {
  const disease = DISEASES_DATA.find((d) => d.id === req.params.id);
  if (!disease) {
    res.status(404).json({ error: `Disease '${req.params.id}' not found` });
    return;
  }
  res.json({ disease });
}

export function searchAnatomy(req: Request, res: Response) {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  if (!q) {
    const empty: SearchResults = { query: '', organs: [], parts: [], diseases: [] };
    res.json(empty);
    return;
  }

  const organs = ORGANS_DATA.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.system.toLowerCase().includes(q) ||
      o.category.toLowerCase().includes(q) ||
      o.poeticSubtitle.toLowerCase().includes(q) ||
      o.relatedSystems.some((s) => s.toLowerCase().includes(q)) ||
      o.tagline.toLowerCase().includes(q),
  ).map((o) => ({
    id: o.id,
    name: o.name,
    system: o.system,
    tagline: o.tagline,
  }));

  const parts: SearchResults['parts'] = [];
  for (const organ of ORGANS_DATA) {
    for (const part of organ.parts) {
      if (
        part.name.toLowerCase().includes(q) ||
        part.parentDivision.toLowerCase().includes(q) ||
        part.functionSummary.toLowerCase().includes(q) ||
        part.location.toLowerCase().includes(q)
      ) {
        parts.push({
          id: part.id,
          organId: organ.id,
          organName: organ.name,
          name: part.name,
          parentDivision: part.parentDivision,
          location: part.location,
        });
      }
    }
  }

  const diseases = DISEASES_DATA.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.shortExplanation.toLowerCase().includes(q) ||
      d.affectedStructures.some((s) => s.toLowerCase().includes(q)),
  ).map((d) => ({
    id: d.id,
    organId: d.organId,
    organName: d.organName,
    name: d.name,
    affectedStructures: d.affectedStructures,
    shortExplanation: d.shortExplanation,
  }));

  res.json({
    query: q,
    organs,
    parts,
    diseases,
  } satisfies SearchResults);
}

export function getQuizzes(req: Request, res: Response) {
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const organId = typeof req.query.organId === 'string' ? req.query.organId.trim() : '';

  let filtered = QUIZZES_DATA;
  if (category && category !== 'All') {
    filtered = filtered.filter((q) => q.category === category);
  }
  if (organId && organId !== 'all') {
    filtered = filtered.filter((q) => q.organId === organId);
  }

  res.json({
    questions: filtered,
    total: filtered.length,
  });
}

const EXCLUDED_DIRS = new Set(['node_modules', 'dist', '.git', '.aistudio', '.next']);
const EXCLUDED_FILES = new Set(['.DS_Store']);

function addDirToZip(zip: JSZip, rootDir: string, currentDir: string) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED_FILES.has(entry.name)) continue;
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      addDirToZip(zip, rootDir, fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.zip')) continue;
      const content = fs.readFileSync(fullPath);
      zip.file(`human-anatomy-explorer/${relativePath}`, content);
    }
  }
}

export async function exportProjectZip(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const projectRoot = process.cwd();
    const zip = new JSZip();
    addDirToZip(zip, projectRoot, projectRoot);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="human-anatomy-explorer.zip"',
    );
    res.setHeader('Content-Length', String(buffer.length));
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
