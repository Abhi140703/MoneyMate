import API from "./api";

export const getGoals = async () => {
  const res = await API.get("/goals");
  return res.data;
};

export const createGoal = async (goal) => {
  const res = await API.post("/goals", goal);
  return res.data;
};

export const updateGoal = async (
  id,
  goal
) => {
  const res = await API.put(
    `/goals/${id}`,
    goal
  );

  return res.data;
};

export const deleteGoal = async (
  id
) => {
  const res = await API.delete(
    `/goals/${id}`
  );

  return res.data;
};