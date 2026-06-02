import { ContentListingLoading } from "@/components/pages";
import { PageHero } from "@/components/layout/PageHero";

export default function ProtocolosLoading() {
  return (
    <>
      <PageHero
        badge="Protocolos"
        title="Rotinas que transformam sua saúde"
        description="Planos passo a passo desenvolvidos com base científica."
      />
      <ContentListingLoading variant="protocols" />
    </>
  );
}
