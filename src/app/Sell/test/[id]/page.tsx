'use client';
// src/app/Sell/test/[id]/page.tsx
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

interface ProjectData {
  _id: string;
  projectname: string;
  description: string;
  receive: string[];
  category: string;
  imageUrl: string[];
}

// Define the component as a React function component that receives params
const ProjectDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProjectData(params.id);
    }
  }, [params.id]);

  const fetchProjectData = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.post); // Ensure data structure matches your API response
      } else {
        console.error('Failed to fetch project data');
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FBFBFB]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{project.projectname}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{project.description}</p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Category</h2>
            <p>{project.category}</p>
            <h2 className="text-xl font-semibold mt-4 mb-2">Receive</h2>
            <ul className="list-disc list-inside">
              {project.receive.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {project.imageUrl.map((url, index) => (
                <img
                key={index}
                src={`/api/project/images/${project.imageUrl[index]}`}
                alt={`Project image ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg"
              />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
