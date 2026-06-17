import API from "./api";

// GET ALL TRANSACTIONS
export const getTransactions = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

// CREATE TRANSACTION
export const createTransaction = async (
  transaction
) => {
  const res = await API.post(
    "/transactions",
    transaction
  );

  return res.data;
};

// UPDATE TRANSACTION
export const updateTransaction = async (
  id,
  transaction
) => {
  const res = await API.put(
    `/transactions/${id}`,
    transaction
  );

  return res.data;
};

// DELETE TRANSACTION
export const deleteTransaction = async (
  id
) => {
  const res = await API.delete(
    `/transactions/${id}`
  );

  return res.data;
};