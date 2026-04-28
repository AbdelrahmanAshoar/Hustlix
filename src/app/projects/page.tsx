import React from 'react'
import { projectsServices } from '@/services/freelancer/projectsServices'
import ProjectsClient from './projectsClient';
export default async function page() {
  const data=await projectsServices();
  const dataProjects=data;
  return <ProjectsClient data={dataProjects}/>
}
