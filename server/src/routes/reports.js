import express from 'express';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import ClientRequest from '../models/ClientRequest.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/pdf', authMiddleware, async (_req, res) => {
  try {
    const requests = await ClientRequest.find().sort({ createdAt: -1 });
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=work4you-requests-report.pdf');
    doc.pipe(res);

    // Cover Page / Title Block
    doc.save();
    doc.rect(50, 50, 500, 150).fill('#1E1B4B');
    doc.restore();

    doc.fillColor('#FFFFFF').fontSize(24).font('Helvetica-Bold').text('Work4You', 70, 80);
    doc.fontSize(16).font('Helvetica').text('Client Requests Portfolio Report', 70, 115);
    doc.fontSize(10).fillColor('#94A3B8').text(`Generated on: ${new Date().toLocaleString()}`, 70, 150);

    doc.fillColor('#111827'); // reset to charcoal
    doc.y = 230; // Move below cover block

    const uploadDir = path.join(process.cwd(), 'uploads');

    requests.forEach((r, i) => {
      // Start each request brief on its own page
      doc.addPage();

      // Page header
      doc.save();
      doc.rect(50, 30, 500, 4).fill('#4F46E5');
      doc.restore();

      doc.fontSize(10).fillColor('#6B7280').font('Helvetica').text('Work4You — Client Request Brief', 50, 40);
      doc.fontSize(8).text(`Brief ${i + 1} of ${requests.length}`, 500, 40, { align: 'right' });
      doc.moveTo(50, 52).lineTo(550, 52).strokeColor('#E5E7EB').stroke();

      doc.fillColor('#111827');
      doc.x = 50;
      doc.y = 65;

      // Organization Header
      doc.fontSize(18).fillColor('#4F46E5').font('Helvetica-Bold').text(r.organization.name);
      doc.fontSize(10).fillColor('#6B7280').font('Helvetica').text(`Submitted: ${new Date(r.createdAt).toLocaleString()}   |   Status: ${r.status.toUpperCase()}`);
      doc.moveDown(1);

      // Section 1: Organization Profile
      doc.fontSize(12).fillColor('#1E1B4B').font('Helvetica-Bold').text('1. Organization Profile');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor('#111827');
      doc.font('Helvetica-Bold').text('Owner Name: ', { continued: true }).font('Helvetica').text(r.organization.ownerName);
      doc.font('Helvetica-Bold').text('Business Type: ', { continued: true }).font('Helvetica').text(r.organization.businessType || 'N/A', { continued: true })
         .font('Helvetica-Bold').text('   |   Industry: ', { continued: true }).font('Helvetica').text(r.organization.industry || 'N/A');
      doc.font('Helvetica-Bold').text('Email Address: ', { continued: true }).font('Helvetica').text(r.organization.email, { continued: true })
         .font('Helvetica-Bold').text('   |   Mobile Number: ', { continued: true }).font('Helvetica').text(r.organization.mobile);
      doc.font('Helvetica-Bold').text('WhatsApp Number: ', { continued: true }).font('Helvetica').text(r.organization.whatsapp || 'N/A');
      doc.font('Helvetica-Bold').text('City: ', { continued: true }).font('Helvetica').text(r.organization.city, { continued: true })
         .font('Helvetica-Bold').text('   |   State: ', { continued: true }).font('Helvetica').text(r.organization.state || 'N/A', { continued: true })
         .font('Helvetica-Bold').text('   |   Country: ', { continued: true }).font('Helvetica').text(r.organization.country);
      doc.font('Helvetica-Bold').text('Physical Address: ', { continued: true }).font('Helvetica').text(r.organization.address || 'N/A');
      doc.moveDown(1);

      // Section 2: Website Requirements
      doc.fontSize(12).fillColor('#1E1B4B').font('Helvetica-Bold').text('2. Project Requirements');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor('#111827');
      doc.font('Helvetica-Bold').text('Website Category: ', { continued: true }).font('Helvetica').text(r.requirements.websiteCategory, { continued: true })
         .font('Helvetica-Bold').text('   |   Number of Pages: ', { continued: true }).font('Helvetica').text(r.requirements.numberOfPages);
      doc.font('Helvetica-Bold').text('Estimated Budget: ', { continued: true }).font('Helvetica').text(r.requirements.budget, { continued: true })
         .font('Helvetica-Bold').text('   |   Expected Deadline: ', { continued: true }).font('Helvetica').text(r.requirements.deadline || 'N/A');
      
      const domainText = r.requirements.domainRequired ? 'Yes' : 'No';
      const hostingText = r.requirements.hostingRequired ? 'Yes' : 'No';
      const seoText = r.requirements.seoRequired ? 'Yes' : 'No';
      doc.font('Helvetica-Bold').text('Domain Required: ', { continued: true }).font('Helvetica').text(domainText, { continued: true })
         .font('Helvetica-Bold').text('   |   Hosting Required: ', { continued: true }).font('Helvetica').text(hostingText, { continued: true })
         .font('Helvetica-Bold').text('   |   SEO Optimization: ', { continued: true }).font('Helvetica').text(seoText);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Purpose & Objectives:');
      doc.font('Helvetica').text(r.requirements.purpose || 'N/A', { align: 'justify' });
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Features Requested:');
      doc.font('Helvetica').text(r.requirements.features && r.requirements.features.length ? r.requirements.features.join(', ') : 'None');
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Design & Aesthetics Preferences:');
      doc.font('Helvetica').text(r.requirements.designPreferences || 'N/A');
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Reference Websites:');
      doc.font('Helvetica').text(r.requirements.referenceWebsites && r.requirements.referenceWebsites.length ? r.requirements.referenceWebsites.join(', ') : 'None');
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Additional Notes:');
      doc.font('Helvetica').text(r.requirements.additionalNotes || 'N/A');
      doc.moveDown(1);

      // Section 3: Uploaded Attachments
      doc.fontSize(12).fillColor('#1E1B4B').font('Helvetica-Bold').text('3. Uploaded Attachments & Previews');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor('#111827');
      if (!r.files || r.files.length === 0) {
        doc.font('Helvetica-Oblique').text('No files were uploaded with this request.');
      } else {
        r.files.forEach((file) => {
          doc.font('Helvetica-Bold').text(`[${file.category.toUpperCase()}] `, { continued: true })
             .font('Helvetica').text(`${file.originalName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        });

        const images = r.files.filter(f => f.category === 'image' || f.category === 'logo' || f.category === 'favicon' || f.mimetype.startsWith('image/'));
        if (images.length > 0) {
          doc.moveDown(0.5);
          doc.font('Helvetica-Bold').text('Embedded Image Previews:');
          doc.moveDown(0.5);

          images.forEach((imgFile) => {
            const filePath = path.join(uploadDir, imgFile.filename);
            if (fs.existsSync(filePath)) {
              try {
                // If there's very little space remaining on the page, force a new page for the image preview
                if (doc.y > 500) {
                  doc.addPage();
                  // Re-draw simplified header on image continuation page
                  doc.save();
                  doc.rect(50, 30, 500, 4).fill('#4F46E5');
                  doc.restore();
                  doc.fontSize(10).fillColor('#6B7280').font('Helvetica').text('Work4You — Client Request Brief (Image Previews Continued)', 50, 40);
                  doc.moveTo(50, 52).lineTo(550, 52).strokeColor('#E5E7EB').stroke();
                  doc.fillColor('#111827');
                  doc.y = 65;
                }
                doc.font('Helvetica-Oblique').fontSize(9).fillColor('#4B5563').text(`File: ${imgFile.originalName} (${imgFile.category})`);
                doc.moveDown(0.2);
                doc.image(filePath, { fit: [200, 150] });
                doc.y += 155;
                doc.moveDown(1.5);
              } catch (err) {
                doc.font('Helvetica').fontSize(10).fillColor('red').text(`[Error loading image ${imgFile.originalName}: ${err.message}]`).fillColor('#111827');
                doc.moveDown();
              }
            } else {
              doc.font('Helvetica-Oblique').fontSize(9).fillColor('#E11D48').text(`File: ${imgFile.originalName} (Not found on server filesystem)`);
              doc.moveDown();
            }
          });
        }
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/excel', authMiddleware, async (_req, res) => {
  try {
    const requests = await ClientRequest.find().sort({ createdAt: -1 });
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Client Requests');

    sheet.columns = [
      { header: 'Organization', key: 'org', width: 25 },
      { header: 'Owner', key: 'owner', width: 20 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'WhatsApp', key: 'whatsapp', width: 15 },
      { header: 'Business Type', key: 'businessType', width: 15 },
      { header: 'Industry', key: 'industry', width: 15 },
      { header: 'Physical Address', key: 'address', width: 30 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Pages', key: 'pages', width: 10 },
      { header: 'Budget Option', key: 'budget', width: 15 },
      { header: 'Deadline', key: 'deadline', width: 15 },
      { header: 'Domain Required', key: 'domain', width: 15 },
      { header: 'Hosting Required', key: 'hosting', width: 15 },
      { header: 'SEO Required', key: 'seo', width: 15 },
      { header: 'Purpose', key: 'purpose', width: 35 },
      { header: 'Features', key: 'features', width: 35 },
      { header: 'Design Preferences', key: 'design', width: 25 },
      { header: 'Reference Websites', key: 'references', width: 30 },
      { header: 'Additional Notes', key: 'notes', width: 35 },
      { header: 'Uploaded Files', key: 'files', width: 35 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Submitted', key: 'date', width: 18 },
    ];

    requests.forEach((r) => {
      const filesList = (r.files || []).map(f => `[${f.category}] ${f.originalName}`).join(', ');
      sheet.addRow({
        org: r.organization.name,
        owner: r.organization.ownerName,
        email: r.organization.email,
        mobile: r.organization.mobile,
        whatsapp: r.organization.whatsapp || '',
        businessType: r.organization.businessType || '',
        industry: r.organization.industry || '',
        address: r.organization.address || '',
        city: r.organization.city,
        state: r.organization.state || '',
        country: r.organization.country,
        category: r.requirements.websiteCategory,
        pages: r.requirements.numberOfPages,
        budget: r.requirements.budget,
        deadline: r.requirements.deadline || '',
        domain: r.requirements.domainRequired ? 'Yes' : 'No',
        hosting: r.requirements.hostingRequired ? 'Yes' : 'No',
        seo: r.requirements.seoRequired ? 'Yes' : 'No',
        purpose: r.requirements.purpose || '',
        features: (r.requirements.features || []).join(', '),
        design: r.requirements.designPreferences || '',
        references: (r.requirements.referenceWebsites || []).join(', '),
        notes: r.requirements.additionalNotes || '',
        files: filesList,
        status: r.status,
        date: new Date(r.createdAt).toLocaleString(),
      });
    });

    sheet.getRow(1).font = { bold: true };
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=work4you-requests.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
