import { useState } from "react";
import { useFinance, type Loan } from "../context/FinanceContext";

export const Loans = () => {
  const { loans, addLoan, deleteLoan, updateLoan } = useFinance();

  const [formData, setFormData] = useState<{
    type: "borrowed" | "lent";
    personName: string;
    totalAmount: string;
    paidAmount: string;
    dueDate: string;
    description: string;
  }>({
    type: "borrowed",
    personName: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: "",
    description: "",
  });
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>(
    {},
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addLoan({
      ...formData,
      totalAmount: Number(formData.totalAmount),
      paidAmount: Number(formData.paidAmount),
    });

    setFormData({
      type: "borrowed",
      personName: "",
      totalAmount: "",
      paidAmount: "",
      dueDate: "",
      description: "",
    });
  };

  const handlePayment = async (loan: Loan) => {
    const amount = Number(paymentAmounts[loan._id]);

    if (!amount || amount <= 0) return;

    await updateLoan(loan._id, {
      paidAmount: loan.paidAmount + amount,

      paymentHistory: [
        ...(loan.paymentHistory || []),

        {
          amount,
          date: new Date().toISOString(),
        },
      ],
    });

    setPaymentAmounts((prev) => ({
      ...prev,
      [loan._id]: "",
    }));
  };

  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);

  const totalPaid = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);

  const totalRemaining = totalBorrowed - totalPaid;

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">Borrowings & Loans</h1>

        <p className="text-slate-500 mt-2">Track money borrowed and lent</p>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
          <h3>Total Borrowed</h3>

          <p className="text-4xl font-bold mt-3">₹{totalBorrowed}</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-3xl p-6 text-white shadow-xl">
          <h3>Total Paid</h3>

          <p className="text-4xl font-bold mt-3">₹{totalPaid}</p>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-6 text-white shadow-xl">
          <h3>Remaining</h3>

          <p className="text-4xl font-bold mt-3">₹{totalRemaining}</p>
        </div>
      </div>

      {/* Add Loan */}

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Add New Loan</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <select
            className="border rounded-xl p-3"
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "borrowed" | "lent",
              })
            }
          >
            <option value="borrowed">Borrowed</option>

            <option value="lent">Lent</option>
          </select>

          <input
            placeholder="Person Name"
            className="border rounded-xl p-3"
            value={formData.personName}
            onChange={(e) =>
              setFormData({
                ...formData,
                personName: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Total Amount"
            className="border rounded-xl p-3"
            value={formData.totalAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalAmount: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Paid Amount"
            className="border rounded-xl p-3"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                paidAmount: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="border rounded-xl p-3"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }
          />

          <input
            placeholder="Description"
            className="border rounded-xl p-3"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <button className="bg-blue-600 text-white p-3 rounded-xl md:col-span-2">
            Add Loan
          </button>
        </form>
      </div>

      {/* Loan Cards */}

      <div className="grid gap-6">
        {loans.map((loan) => {
          const remaining = loan.totalAmount - loan.paidAmount;
          const isOverdue =
            remaining > 0 && new Date(loan.dueDate) < new Date();

          const percentage = (loan.paidAmount / loan.totalAmount) * 100;

          return (
            <div
              key={loan._id}
              className={`rounded-3xl p-6 shadow-lg ${
                isOverdue
                  ? "bg-red-50 border-2 border-red-500"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{loan.personName}</h2>

                  {isOverdue && (
                    <p className="text-red-600 font-semibold">
                      ⚠️ Loan Overdue
                    </p>
                  )}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    loan.type === "borrowed"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {loan.type}
                </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <span>Progress</span>

                  <span>{Math.round(percentage)}%</span>
                </div>

                <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                  <div
                    className="h-3 bg-green-500 rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500">Total Amount</p>

                  <p className="font-bold text-xl">₹{loan.totalAmount}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500">Paid Amount</p>

                  <p className="font-bold text-xl">₹{loan.paidAmount}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500">Remaining</p>

                  <p className="font-bold text-xl text-red-500">₹{remaining}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500">Due Date</p>

                  <p className="font-bold text-xl">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-slate-500">Description</p>

                <p>{loan.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Payment History</h3>

                {loan.paymentHistory && loan.paymentHistory.length > 0 ? (
                  <div className="space-y-2">
                    {loan.paymentHistory.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-xl"
                      >
                        <span>
                          {new Date(payment.date).toLocaleDateString()}
                        </span>

                        <span className="font-semibold text-green-600">
                          ₹{payment.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No payments recorded yet</p>
                )}
              </div>

              {/* Payment Section */}

              {remaining > 0 && (
                <div className="mt-6 flex gap-3 flex-wrap">
                  <input
                    type="number"
                    placeholder="Enter payment amount"
                    className="border rounded-xl px-4 py-2"
                    value={paymentAmounts[loan._id] || ""}
                    onChange={(e) =>
                      setPaymentAmounts({
                        ...paymentAmounts,
                        [loan._id]: e.target.value,
                      })
                    }
                  />

                  <button
                    onClick={() => handlePayment(loan)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
                  >
                    Record Payment
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mt-6">
                <span
                  className={`font-semibold ${
                    remaining === 0 ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {remaining === 0 ? "✅ Paid Off" : "⏳ Pending"}
                </span>

                <button
                  onClick={() => deleteLoan(loan._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
