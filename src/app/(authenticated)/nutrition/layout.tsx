// This is a pass-through layout — auth is handled by the parent (authenticated) layout
export default function NutritionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
