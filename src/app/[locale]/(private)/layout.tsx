import LayoutWrapper from "@/app/Shared/components/LayoutWrapper";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper className="w-full flex-1 mt-10">{children}</LayoutWrapper>;
}
