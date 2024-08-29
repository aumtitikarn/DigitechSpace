import express from 'express';
import next from 'next';
import { getProjectById } from './lib/getProjectById'; // Import the function here

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/api/project/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const project = await getProjectById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project data:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, (err?: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
