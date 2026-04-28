import { getProjects } from "@/services/client/getProjects";
import ClientDashboard from "./clientDashboard";

export default async function client() {
  const data= await getProjects();
  const projects = data?.projects || [];
  return <ClientDashboard data={projects}/>
}
