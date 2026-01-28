import { redirect } from "next/navigation";
import { onBoardUser } from "@/modules/auth/actions";

export default async function OnboardingPage() {
  await onBoardUser();
  redirect("/");
}
