import api from "./axios";

export const getJobs = () => api.get("/jobs");
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (jobData) => api.post("/jobs", jobData);
export const completeJob = (id) => api.put(`/jobs/${id}/complete`);
export const getMyJobs = () => api.get("/jobs/my-jobs");
