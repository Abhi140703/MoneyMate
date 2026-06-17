import API from "./api";

// GET
export const getLoans = async () => {
  const res = await API.get("/loans");
  return res.data;
};

// CREATE
export const createLoan = async (
  loan
) => {
  const res = await API.post(
    "/loans",
    loan
  );

  return res.data;
};

// UPDATE
export const updateLoan = async (
  id,
  loan
) => {
  const res = await API.put(
    `/loans/${id}`,
    loan
  );

  return res.data;
};

// DELETE
export const deleteLoan = async (
  id
) => {
  const res = await API.delete(
    `/loans/${id}`
  );

  return res.data;
};