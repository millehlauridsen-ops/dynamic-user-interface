import { useLocalStorage } from "./useLocalStorage.js";
import { createProject, initialProjects } from "../services/projectService.js";

export function useProjects() {
  const [projects, setProjects] = useLocalStorage("projects", initialProjects);

  function addProject(data) {
    const project = createProject(data);
    setProjects((current) => [project, ...current]);
    return project;
  }

  function changeStatus(id, status) {
    setProjects((current) => current.map((project) =>
      project.id === id
        ? { ...project, status, updatedAt: new Date().toISOString() }
        : project,
    ));
  }

  function removeProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id));
  }

  function resetProjects() {
    setProjects(initialProjects);
  }

  return { projects, addProject, changeStatus, removeProject, resetProjects };
}
