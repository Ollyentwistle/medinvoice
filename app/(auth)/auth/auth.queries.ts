import { UserBase } from "@/models/users";

export async function addUser(data: UserBase) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  console.log(res);

  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
}

export async function getUser(email: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users?email=${email}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res);

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
