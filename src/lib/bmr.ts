/**
 * Basal metabolic rate and daily calorie needs.
 *
 * BMR uses the Mifflin-St Jeor equation (Mifflin et al., American Journal of
 * Clinical Nutrition, 1990), which is the estimate most dietitians use today:
 *   men:   10 × weight(kg) + 6.25 × height(cm) − 5 × age + 5
 *   women: 10 × weight(kg) + 6.25 × height(cm) − 5 × age − 161
 * Total daily energy expenditure multiplies BMR by an activity factor.
 * These are population estimates; individual needs vary.
 */

export type Sex = "male" | "female";

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary — little or no exercise", factor: 1.2 },
  { id: "light", label: "Lightly active — exercise 1–3 days a week", factor: 1.375 },
  { id: "moderate", label: "Moderately active — exercise 3–5 days a week", factor: 1.55 },
  { id: "very", label: "Very active — hard exercise 6–7 days a week", factor: 1.725 },
  { id: "extra", label: "Extra active — physical job plus training", factor: 1.9 },
] as const;

export type ActivityId = (typeof ACTIVITY_LEVELS)[number]["id"];

export function mifflinStJeor(sex: Sex, weightKg: number, heightCm: number, age: number): number | null {
  if (!(weightKg > 0) || !(heightCm > 0) || !(age >= 15) || age > 120) return null;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export function dailyCalories(bmr: number, activity: ActivityId): number {
  const level = ACTIVITY_LEVELS.find((entry) => entry.id === activity) ?? ACTIVITY_LEVELS[0];
  return bmr * level.factor;
}

export const KG_PER_LB = 0.45359237;
export const CM_PER_INCH = 2.54;
