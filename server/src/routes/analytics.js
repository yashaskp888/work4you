import express from 'express';
import ClientRequest from '../models/ClientRequest.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

function publicRecentRequest(request) {
  return {
    _id: request._id,
    organization: { name: request.organization?.name || 'Client' },
    requirements: {
      websiteCategory: request.requirements?.websiteCategory || 'General',
      budget: request.requirements?.budget || '—',
    },
    status: request.status,
    createdAt: request.createdAt,
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

router.get('/dashboard', authMiddleware, async (_req, res) => {
  try {
    const [
      totalClients,
      completedProjects,
      activeProjects,
      maintenanceProjects,
      recentRequests,
      allRequests,
    ] = await Promise.all([
      ClientRequest.distinct('organization.email').then((e) => e.length),
      ClientRequest.countDocuments({ status: 'completed' }),
      ClientRequest.countDocuments({ status: { $in: ['pending', 'reviewing', 'in_progress'] } }),
      ClientRequest.countDocuments({ 'requirements.hostingRequired': true, status: { $ne: 'cancelled' } }),
      ClientRequest.find().sort({ createdAt: -1 }).limit(8),
      ClientRequest.find(),
    ]);

    const monthlyRevenue = allRequests.reduce((sum, r) => sum + (r.estimatedRevenue || 0), 0);

    const now = new Date();
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = allRequests.filter((r) => {
        const c = new Date(r.createdAt);
        return c.getMonth() === month && c.getFullYear() === year;
      }).length;
      const revenue = allRequests
        .filter((r) => {
          const c = new Date(r.createdAt);
          return c.getMonth() === month && c.getFullYear() === year;
        })
        .reduce((s, r) => s + (r.estimatedRevenue || 0), 0);
      monthlyGrowth.push({ month: MONTHS[month], requests: count, revenue });
    }

    const serviceMap = {};
    allRequests.forEach((r) => {
      const key = r.serviceType || r.requirements?.websiteCategory || 'Other';
      serviceMap[key] = (serviceMap[key] || 0) + 1;
    });
    const serviceDistribution = Object.entries(serviceMap).map(([name, value]) => ({ name, value }));

    const statusDistribution = [
      { name: 'Pending', value: allRequests.filter((r) => r.status === 'pending').length },
      { name: 'Reviewing', value: allRequests.filter((r) => r.status === 'reviewing').length },
      { name: 'In Progress', value: allRequests.filter((r) => r.status === 'in_progress').length },
      { name: 'Completed', value: allRequests.filter((r) => r.status === 'completed').length },
    ];

    const revenueByMonth = monthlyGrowth.map((m) => ({ month: m.month, revenue: m.revenue }));

    res.json({
      success: true,
      data: {
        stats: {
          totalClients: totalClients || 247,
          projectsCompleted: completedProjects || 189,
          activeProjects: activeProjects || 34,
          websitesUnderMaintenance: maintenanceProjects || 56,
          monthlyRevenue: monthlyRevenue || 48500,
        },
        monthlyGrowth,
        revenueByMonth,
        serviceDistribution: serviceDistribution.length ? serviceDistribution : [
          { name: 'Business Websites', value: 45 },
          { name: 'E-Commerce', value: 28 },
          { name: 'Corporate', value: 22 },
          { name: 'Custom Solutions', value: 15 },
        ],
        statusDistribution,
        recentRequests: recentRequests.map(publicRecentRequest),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/showcase', async (_req, res) => {
  try {
    const [
      totalClients,
      completedProjects,
      activeProjects,
      maintenanceProjects,
      recentRequests,
      allRequests,
    ] = await Promise.all([
      ClientRequest.distinct('organization.email').then((e) => e.length),
      ClientRequest.countDocuments({ status: 'completed' }),
      ClientRequest.countDocuments({ status: { $in: ['pending', 'reviewing', 'in_progress'] } }),
      ClientRequest.countDocuments({ 'requirements.hostingRequired': true, status: { $ne: 'cancelled' } }),
      ClientRequest.find().sort({ createdAt: -1 }).limit(8),
      ClientRequest.find(),
    ]);

    // Anonymized stats (approximate, rounded, or generic)
    const monthlyRevenue = allRequests.reduce((sum, r) => sum + (r.estimatedRevenue || 0), 0);
    const roundedMonthlyRevenue = Math.round(monthlyRevenue / 1000) * 1000;

    const now = new Date();
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const count = allRequests.filter((r) => {
        const c = new Date(r.createdAt);
        return c.getMonth() === month && c.getFullYear() === year;
      }).length;
      const revenue = allRequests
        .filter((r) => {
          const c = new Date(r.createdAt);
          return c.getMonth() === month && c.getFullYear() === year;
        })
        .reduce((s, r) => s + (r.estimatedRevenue || 0), 0);
      const roundedRevenue = Math.round(revenue / 1000) * 1000;
      monthlyGrowth.push({ month: MONTHS[month], requests: count, revenue: roundedRevenue });
    }

    const serviceMap = {};
    allRequests.forEach((r) => {
      const key = r.serviceType || r.requirements?.websiteCategory || 'Other';
      serviceMap[key] = (serviceMap[key] || 0) + 1;
    });
    const serviceDistribution = Object.entries(serviceMap).map(([name, value]) => ({ name, value }));

    const statusDistribution = [
      { name: 'Pending', value: allRequests.filter((r) => r.status === 'pending').length },
      { name: 'Reviewing', value: allRequests.filter((r) => r.status === 'reviewing').length },
      { name: 'In Progress', value: allRequests.filter((r) => r.status === 'in_progress').length },
      { name: 'Completed', value: allRequests.filter((r) => r.status === 'completed').length },
    ];

    const revenueByMonth = monthlyGrowth.map((m) => ({ month: m.month, revenue: m.revenue }));

    // Helper to completely anonymize requests for the public
    const anonymizedRecentRequest = (request) => {
      const industry = request.organization?.industry || 'Business';
      const category = request.requirements?.websiteCategory || 'Website';
      return {
        _id: request._id,
        organization: { name: `Client (${industry})` },
        requirements: {
          websiteCategory: category,
          budget: 'Confidential',
        },
        status: request.status,
        createdAt: request.createdAt,
      };
    };

    res.json({
      success: true,
      data: {
        stats: {
          totalClients: totalClients || 247,
          projectsCompleted: completedProjects || 189,
          activeProjects: activeProjects || 34,
          websitesUnderMaintenance: maintenanceProjects || 56,
          monthlyRevenue: roundedMonthlyRevenue || 48500,
        },
        monthlyGrowth,
        revenueByMonth,
        serviceDistribution: serviceDistribution.length ? serviceDistribution : [
          { name: 'Business Websites', value: 45 },
          { name: 'E-Commerce', value: 28 },
          { name: 'Corporate', value: 22 },
          { name: 'Custom Solutions', value: 15 },
        ],
        statusDistribution,
        recentRequests: recentRequests.map(anonymizedRecentRequest),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/revenue', authMiddleware, async (_req, res) => {
  try {
    const requests = await ClientRequest.find();
    const total = requests.reduce((s, r) => s + (r.estimatedRevenue || 0), 0);
    const completed = requests
      .filter((r) => r.status === 'completed')
      .reduce((s, r) => s + (r.estimatedRevenue || 0), 0);
    const pending = requests
      .filter((r) => r.status !== 'completed' && r.status !== 'cancelled')
      .reduce((s, r) => s + (r.estimatedRevenue || 0), 0);

    res.json({
      success: true,
      data: { total, completed, pending, count: requests.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
