export const selectFreelancer = async (proposalId: number) => {
  const res = await fetch("/api/selectFreelancer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proposalId }),
  });

  console.log("Response from selectFreelancer:", proposalId);

  const data = await res.json();

  return data;
};