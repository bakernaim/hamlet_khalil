import TourismForm from "@/components/admin/TourismForm";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TourismForm id={id} />;
}
