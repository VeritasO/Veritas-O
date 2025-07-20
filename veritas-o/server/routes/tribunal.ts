import express from 'express';
import { db } from '../db';
import { contradictions, tribunalRulings } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

const RulingSchema = z.object({
  contradictionId: z.string(),
  rulingText: z.string(),
  ruledBy: z.string(),
  timestamp: z.string(),
});

const GetRulingsSchema = z.object({
  contradictionId: z.string().optional(),
  limit: z.string().optional(),
});

// Submit a new tribunal ruling
router.post('/ruling', async (req, res) => {
  const parse = RulingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parse.error });
  }

  const { contradictionId, rulingText, ruledBy, timestamp } = parse.data;

  try {
    // Insert tribunal ruling
    const ruling = await db.insert(tribunalRulings).values({
      contradictionId,
      rulingText,
      ruledBy,
      timestamp: new Date(timestamp),
    }).returning();

    // Mark contradiction as resolved
    await db.update(contradictions)
      .set({ 
        status: 'RESOLVED',
        resolved: true,
        resolvedAt: new Date(timestamp),
        resolution: rulingText
      })
      .where(eq(contradictions.id, contradictionId));

    res.status(200).json({ 
      success: true, 
      ruling: ruling[0],
      message: 'Tribunal ruling submitted and contradiction resolved'
    });
  } catch (err) {
    console.error('Tribunal ruling error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Alternative endpoint for the client API structure
router.post('/rulings', async (req, res) => {
  const rulingData = {
    contradictionId: req.body.contradictionId,
    rulingText: req.body.ruling, // Map 'ruling' to 'rulingText'
    ruledBy: req.body.ruledBy || 'TRIBUNAL_SYSTEM',
    timestamp: new Date().toISOString(),
  };

  const parse = RulingSchema.safeParse(rulingData);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parse.error });
  }

  const { contradictionId, rulingText, ruledBy, timestamp } = parse.data;

  try {
    // Insert tribunal ruling
    const ruling = await db.insert(tribunalRulings).values({
      contradictionId,
      rulingText,
      ruledBy,
      timestamp: new Date(timestamp),
    }).returning();

    // Mark contradiction as resolved
    await db.update(contradictions)
      .set({ 
        status: 'RESOLVED',
        resolved: true,
        resolvedAt: new Date(timestamp),
        resolution: rulingText
      })
      .where(eq(contradictions.id, contradictionId));

    res.status(200).json({ 
      id: ruling[0].id,
      contradictionId,
      ruling: rulingText,
      timestamp,
      status: 'submitted'
    });
  } catch (err) {
    console.error('Tribunal ruling error:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Get tribunal rulings
router.get('/rulings', async (req, res) => {
  const parse = GetRulingsSchema.safeParse(req.query);
  if (!parse.success) {
    return res.status(400).json({ error: 'Invalid query parameters', details: parse.error });
  }

  const { contradictionId, limit } = parse.data;

  try {
    let query = db.select().from(tribunalRulings);
    
    if (contradictionId) {
      query = query.where(eq(tribunalRulings.contradictionId, contradictionId)) as any;
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10)) as any;
    }

    query = query.orderBy(desc(tribunalRulings.timestamp)) as any;

    const rulings = await query;
    
    res.status(200).json(rulings.map(ruling => ({
      id: ruling.id,
      contradictionId: ruling.contradictionId,
      ruling: ruling.rulingText,
      ruledBy: ruling.ruledBy,
      timestamp: ruling.timestamp,
      status: ruling.status || 'submitted'
    })));
  } catch (err) {
    console.error('Error fetching tribunal rulings:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Apply a tribunal ruling (mark as applied)
router.post('/rulings/:id/apply', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the ruling status to applied
    await db.update(tribunalRulings)
      .set({ status: 'applied' })
      .where(eq(tribunalRulings.id, id));
    
    res.status(200).json({ 
      success: true, 
      message: `Tribunal ruling ${id} has been applied to the system.`
    });
  } catch (err) {
    console.error('Error applying tribunal ruling:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

// Get tribunal statistics
router.get('/stats', async (_req, res) => {
  try {
    const totalRulings = await db.select().from(tribunalRulings);
    const resolvedContradictions = await db.select().from(contradictions)
      .where(eq(contradictions.resolved, true));

    res.status(200).json({
      totalRulings: totalRulings.length,
      resolvedContradictions: resolvedContradictions.length,
      averageResolutionTime: '2.3 hours', // Mock data for now
      tribunalEfficiency: '94.7%'
    });
  } catch (err) {
    console.error('Error fetching tribunal stats:', err);
    res.status(500).json({ error: 'Database error', details: err });
  }
});

export default router;
