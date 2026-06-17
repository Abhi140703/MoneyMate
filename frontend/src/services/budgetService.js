import API from "./api";

// GET
export const getBudgets = async () => {
  const res = await API.get("/budgets");
  return res.data;
};

// CREATE
export const createBudget = async (
  budget
) => {
  const res = await API.post(
    "/budgets",
    budget
  );

  return res.data;
};

// UPDATE
export const updateBudget = async (
  id,
  budget
) => {
  const res = await API.put(
    `/budgets/${id}`,
    budget
  );

  return res.data;
};

// DELETE
export const deleteBudget = async (
  id
) => {
  const res = await API.delete(
    `/budgets/${id}`
  );

  return res.data;
};