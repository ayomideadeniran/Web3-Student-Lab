import { Request, Response, Router } from 'express';
import logger from '../utils/logger.js';
import {
  canonicalizeWebhookPayload,
  enqueueWebhookDeliveries,
  verifyWebhookSignature,
} from '../services/webhooks/index.js';
import type {
  WebhookDestination,
  WebhookEventPayload,
} from '../services/webhooks/index.js';

const router = Router();

const getIngestSecret = (): string => {
  return process.env.WEBHOOK_INGEST_SECRET || process.env.WEBHOOK_SIGNING_SECRET || 'webhook-secret';
};

const extractBody = (body: unknown): {
  event: WebhookEventPayload;
  destinations: WebhookDestination[];
  metadata?: Record<string, unknown>;
} => {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be an object');
  }

  const candidate = body as {
    event?: WebhookEventPayload;
    destinations?: WebhookDestination[];
    metadata?: Record<string, unknown>;
  };

  if (!candidate.event || !candidate.destinations || candidate.destinations.length === 0) {
    throw new Error('Request body must include an event and at least one destination');
  }

  return {
    event: candidate.event,
    destinations: candidate.destinations,
    metadata: candidate.metadata,
  };
};

router.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    mode: 'webhook-dispatch',
  });
});

router.post(['/ingest', '/dispatch'], async (req: Request, res: Response) => {
  try {
    const timestamp = req.header('x-webhook-timestamp') || '';
    const signature = req.header('x-webhook-signature') || '';
    const canonicalBody = canonicalizeWebhookPayload(req.body);
    const secret = getIngestSecret();

    if (!verifyWebhookSignature(canonicalBody, signature, secret, timestamp)) {
      logger.warn('Rejected webhook dispatch request with invalid signature');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const { event, destinations, metadata } = extractBody(req.body);
    const results = await enqueueWebhookDeliveries(event, destinations, metadata);

    return res.status(202).json({
      status: 'accepted',
      deliveries: results,
    });
  } catch (error) {
    logger.error('Failed to accept webhook dispatch request:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid webhook dispatch request',
    });
  }
});

export default router;
