import api from "./axios";

export const applyToJob = (jobId, data) =>api.post(`/applications/${jobId}`, data);

export const getApplicationsForJob = (jobId) =>api.get(`/applications/job/${jobId}`) ;

export const acceptApplication = (id) =>api.put(`/applications/${id}/accept`) ;


export const getMyApplications = () => api.get("/applications/my-applications");