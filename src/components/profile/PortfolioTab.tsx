import Image from "next/image";

interface Project {
  title: string;
  details: string;
  fileUrl: string;
}

interface Portfolio {
  mainLink?: string;
  projects: Project[];
}

interface PortfolioTabProps {
  data: {
    portfolio: Portfolio;
  };
}

export default function PortfolioTab({ data }: PortfolioTabProps) {
  const { portfolio } = data;

  const getFullUrl = (path: string): string => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `http://proafree.runasp.net${path}`;
  };

  const renderPortfolioLink = () => {
    if (!portfolio.mainLink) return null;

    return (
      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">Portfolio Link</p>
        <a
          href={portfolio.mainLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Visit My Portfolio
        </a>
      </div>
    );
  };

  const renderProjects = () => {
    if (!portfolio.projects.length) {
      return (
        <p className="text-center text-gray-400">
          No projects yet 🚀
        </p>
      );
    }

    return (
      <div className="grid md:grid-cols-3 gap-4">
        {portfolio.projects.map((project, index) => (
          <div
            key={index}
            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={getFullUrl(project.fileUrl)}
                alt={project.title}
                fill
                className="object-cover hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-500">{project.details}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderPortfolioLink()}
      {renderProjects()}
    </div>
  );
}
