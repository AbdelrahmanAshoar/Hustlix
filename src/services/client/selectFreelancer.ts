export const selectFreelancer = async (proposalId: number) => {
  const res = await fetch("/api/selectFreelancer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proposalId }),
  });


  const data = await res.json();

  return data;
};