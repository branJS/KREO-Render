import { getProjects } from "@/lib/sanity.server";

export default async function ProjectsSection() {
  const projects = await getProjects();

  return (
    <section id="projects" className="section">
      <div className="panel center">
        <h2 className="title">Projects</h2>
        <ul>
          {projects.map((p: any, i: number) => (
            <li key={i}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}