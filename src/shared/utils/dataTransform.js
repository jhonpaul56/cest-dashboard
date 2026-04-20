// Optimized data transformation utilities for Supabase integration

/**
 * Transform Supabase project data to frontend format
 * Handles both old localStorage and new Supabase structures
 */
export const transformProject = (project) => {
  if (!project) return null;
  
  return {
    ...project,
    // Standardize component structure
    components: project.project_components?.map(pc => pc.component?.id) || 
                project.components || [],
    // Standardize community types
    communities: project.project_community_types?.map(pct => pct.community_type?.id) || 
                 project.communities || [],
    // Standardize field names - ensure strings
    project: typeof project.project_title === 'string' ? project.project_title : 
             typeof project.project === 'string' ? project.project : '',
    project_title: typeof project.project_title === 'string' ? project.project_title : 
                   typeof project.project === 'string' ? project.project : '',
    amountFunded: Number(project.amount_funded || project.amountFunded || 0),
    amountPerYear: Number(project.amount_per_year || project.amountPerYear || 0),
    // Standardize location data - ensure strings
    municipality: typeof project.municipality === 'object' ? project.municipality?.name || '' : 
                  typeof project.municipality === 'string' ? project.municipality : '',
    province: typeof project.province === 'object' ? project.province?.name || '' : 
              typeof project.province === 'string' ? project.province : '',
    // Ensure required objects exist
    beneficiaries: project.beneficiaries || {},
    stakeholders: project.stakeholders || {}
  };
};

/**
 * Transform array of projects
 */
export const transformProjects = (projects = []) => {
  return projects.map(transformProject).filter(Boolean);
};

/**
 * Transform Supabase equipment data to frontend format
 */
export const transformEquipment = (equipment) => {
  if (!equipment) return null;
  
  const transformed = {
    ...equipment,
    // Standardize location data - ensure strings
    municipality: typeof equipment.municipality === 'object' ? equipment.municipality?.name || '' : 
                  typeof equipment.municipality === 'string' ? equipment.municipality : '',
    // Standardize equipment fields - ensure strings
    equipmentName: typeof equipment.equipment_name === 'string' ? equipment.equipment_name : 
                   typeof equipment.equipmentName === 'string' ? equipment.equipmentName : '',
    equipment_name: typeof equipment.equipment_name === 'string' ? equipment.equipment_name : 
                    typeof equipment.equipmentName === 'string' ? equipment.equipmentName : '',
    amountFunded: Number(equipment.amount_funded || equipment.amountFunded || 0),
    component: typeof equipment.component === 'object' ? equipment.component?.name || equipment.component?.id || '' :
               typeof equipment.component_id === 'string' ? equipment.component_id :
               typeof equipment.component === 'string' ? equipment.component : '',
    // Get project name from multiple possible sources - ensure strings
    projectName: typeof equipment.project?.project_title === 'string' ? equipment.project.project_title : 
                 typeof equipment.project_title === 'string' ? equipment.project_title : 
                 typeof equipment.projectName === 'string' ? equipment.projectName : 
                 null,
    project_title: typeof equipment.project?.project_title === 'string' ? equipment.project.project_title : 
                   typeof equipment.project_title === 'string' ? equipment.project_title : 
                   null,
    // Preserve project_id for linking
    project_id: equipment.project_id || (equipment.project?.id ? equipment.project.id : null)
  };
  
  // Debug logging for equipment transformation
  if (transformed.project_id || transformed.projectName || transformed.project_title) {
    console.log('Equipment with project link transformed:', {
      id: transformed.id,
      name: transformed.equipment_name,
      project_id: transformed.project_id,
      projectName: transformed.projectName,
      project_title: transformed.project_title
    });
  }
  
  return transformed;
};

/**
 * Transform array of equipment
 */
export const transformEquipmentList = (equipment = []) => {
  return equipment.map(transformEquipment).filter(Boolean);
};