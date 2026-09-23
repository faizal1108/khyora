import { Router } from 'express';
import { pool } from '../db/pool.js';
import { AuthedRequest, requireAuth } from '../middleware/auth.js';
import { ImageValidationError, parseImageField } from '../services/imageValidation.js';
import { analyzeScanImage } from '../services/scanAnalysis.js';

export const scansRouter = Router();

scansRouter.use(requireAuth);

function toDataUri(mimeType: string, base64Data: string): string {
  return `data:${mimeType};base64,${base64Data}`;
}

scansRouter.post('/', async (req: AuthedRequest, res) => {
  try {
    const { image, fileName, mimeType } = req.body as {
      image?: string;
      fileName?: string;
      mimeType?: string;
    };

    if (!image || typeof image !== 'string') {
      res.status(400).json({ error: 'Please select an image.' });
      return;
    }

    const parsed = parseImageField(image, mimeType);
    const analysis = analyzeScanImage(parsed.buffer);

    const result = await pool.query(
      `INSERT INTO health_scans (
        user_id, image_data, mime_type, file_name, file_size,
        flow_level, infection_risk, analysis_result
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at`,
      [
        req.uid,
        parsed.base64Data,
        parsed.mimeType,
        fileName ?? null,
        parsed.fileSize,
        analysis.flowLevel,
        analysis.infectionRisk,
        JSON.stringify(analysis),
      ],
    );

    const row = result.rows[0];
    console.log(
      JSON.stringify({
        event: 'scan_created',
        scanId: row.id,
        userId: req.uid,
        fileSize: parsed.fileSize,
        timestamp: row.created_at,
      }),
    );

    res.status(201).json({
      success: true,
      scanId: row.id,
      flowLevel: analysis.flowLevel,
      infectionRisk: analysis.infectionRisk,
      indicators: analysis.indicators,
      confidence: analysis.confidence,
      notes: analysis.notes,
      disclaimer: analysis.disclaimer,
      createdAt: row.created_at,
    });
  } catch (error) {
    if (error instanceof ImageValidationError) {
      const message =
        error.status === 413 ? 'Image is too large.' : error.message;
      res.status(error.status).json({ error: message });
      return;
    }
    console.error('scan_create_failed', { userId: req.uid });
    res.status(500).json({ error: 'Internal server error' });
  }
});

scansRouter.get('/', async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, flow_level, infection_risk, file_size, created_at
       FROM health_scans
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.uid],
    );

    res.json(
      result.rows.map((row) => ({
        id: row.id,
        flowLevel: row.flow_level,
        infectionRisk: row.infection_risk,
        fileSize: row.file_size,
        createdAt: row.created_at,
      })),
    );
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

scansRouter.get('/:scanId', async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT id, image_data, mime_type, flow_level, infection_risk,
              analysis_result, created_at
       FROM health_scans
       WHERE id = $1 AND user_id = $2`,
      [req.params.scanId, req.uid],
    );

    if (!result.rows.length) {
      res.status(404).json({ error: 'Scan not found' });
      return;
    }

    const row = result.rows[0];
    const analysis = row.analysis_result as {
      indicators?: string[];
      confidence?: number;
      notes?: string;
      disclaimer?: string;
    } | null;

    res.json({
      id: row.id,
      image: toDataUri(row.mime_type, row.image_data),
      mimeType: row.mime_type,
      flowLevel: row.flow_level,
      infectionRisk: row.infection_risk,
      indicators: analysis?.indicators ?? [],
      confidence: analysis?.confidence ?? 0,
      notes: analysis?.notes ?? '',
      disclaimer: analysis?.disclaimer ?? '',
      createdAt: row.created_at,
    });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});
