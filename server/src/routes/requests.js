import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import ClientRequest from '../models/ClientRequest.js';
import { authMiddleware } from '../middleware/auth.js';
import { submitLimiter } from '../middleware/security.js';
import {
  sanitizeOrganization,
  sanitizeRequirements,
  sanitizeString,
  escapeRegex,
} from '../middleware/validate.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx']);
    const allowedMime = new Set([
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);

    if (!allowedExt.has(ext) || !allowedMime.has(file.mimetype)) {
      cb(new Error('File type not allowed'));
      return;
    }
    cb(null, true);
  },
});

function parseBudget(budget) {
  const map = {
    // Legacy USD options
    'under-500': 400,
    '500-1000': 750,
    '1000-2500': 1750,
    '2500-5000': 3750,
    '5000-10000': 7500,
    '10000+': 12000,
    // Rupee options
    'under-5000': 4000,
    '5000-10000': 7500,
    '10000-25000': 17500,
    '25000-50000': 37500,
    '50000-100000': 75000,
    '100000': 120000,
  };
  return map[budget] || 1500;
}

function parseJsonField(value, fallback = {}) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value || fallback;
}

router.post('/submit', submitLimiter, upload.array('files', 10), async (req, res) => {
  try {
    const organization = sanitizeOrganization(parseJsonField(req.body.organization));
    const requirements = sanitizeRequirements(parseJsonField(req.body.requirements));

    if (!organization || !requirements) {
      return res.status(400).json({ success: false, message: 'Required fields missing or invalid' });
    }

    const allowedCategories = new Set(['logo', 'favicon', 'document', 'image', 'reference', 'other']);
    const categories = parseJsonField(req.body.fileCategories, []);

    const files = (req.files || []).map((file, index) => {
      const category = sanitizeString(categories[index], 20);
      return {
        filename: file.filename,
        originalName: sanitizeString(file.originalname, 200),
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        category: allowedCategories.has(category) ? category : 'other',
      };
    });

    const request = await ClientRequest.create({
      organization,
      requirements: {
        ...requirements,
        features: requirements.features || [],
        referenceWebsites: requirements.referenceWebsites || [],
      },
      files,
      estimatedRevenue: parseBudget(requirements.budget),
      serviceType: requirements.websiteCategory,
    });

    res.status(201).json({ success: true, message: 'Request submitted successfully', data: request });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: 'File upload failed. Check size and type.' });
    }
    if (error.message === 'File type not allowed') {
      return res.status(400).json({ success: false, message: 'One or more files have a disallowed type.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    const validStatuses = new Set(['pending', 'reviewing', 'in_progress', 'completed', 'cancelled']);
    if (status && status !== 'all' && typeof status === 'string' && validStatuses.has(status)) {
      query.status = status;
    }
    if (search) {
      const safeSearch = escapeRegex(sanitizeString(search, 80));
      if (safeSearch) {
        query.$or = [
          { 'organization.name': { $regex: safeSearch, $options: 'i' } },
          { 'organization.email': { $regex: safeSearch, $options: 'i' } },
          { 'organization.ownerName': { $regex: safeSearch, $options: 'i' } },
        ];
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total] = await Promise.all([
      ClientRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ClientRequest.countDocuments(query),
    ]);

    res.json({ success: true, data: requests, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/recent', authMiddleware, async (_req, res) => {
  try {
    const requests = await ClientRequest.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const request = await ClientRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const { status } = req.body;
    const valid = ['pending', 'reviewing', 'in_progress', 'completed', 'cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const request = await ClientRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const request = await ClientRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
