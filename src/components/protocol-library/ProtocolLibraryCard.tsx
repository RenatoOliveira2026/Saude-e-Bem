import { FavoriteButton } from "@/components/club/FavoriteButton";
import { ContentCover } from "@/components/content/ContentCover";
import { Icon, IconBox } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getProtocolCategoryIcon } from "@/lib/protocol-library/constants";
import { isUuid } from "@/lib/protocol-library/utils";
import type { ProtocolLibraryItem } from "@/lib/protocol-library/types";
import { routes } from "@/lib/routes";

interface ProtocolLibraryCardProps {
  protocol: ProtocolLibraryItem;
  favorited?: boolean;
  showFavorite?: boolean;
  loginRequired?: boolean;
  compact?: boolean;
}

export function ProtocolLibraryCard({
  protocol,
  favorited = false,
  showFavorite = false,
  loginRequired = false,
  compact = false,
}: ProtocolLibraryCardProps) {
  const icon = getProtocolCategoryIcon(protocol.normalizedCategory);
  const canFavorite = showFavorite && isUuid(protocol.id);

  return (
    <Card
      variant={protocol.isPremium ? "default" : "default"}
      hover
      padding={compact ? "md" : "lg"}
      className={`flex h-full flex-col ${!protocol.isPremium ? "ring-1 ring-sage/30" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <ContentCover
          src={protocol.coverImageUrl}
          alt={protocol.title}
          className={compact ? "h-12 w-12 shrink-0" : "h-16 w-16 shrink-0"}
        >
          <IconBox name={icon} size={compact ? 18 : 20} />
        </ContentCover>
        <div className="flex flex-wrap justify-end gap-2">
          {!protocol.isPremium && (
            <Badge variant="forest" className="shrink-0">
              Gratuito
            </Badge>
          )}
          {protocol.isPremium && <Badge variant="gold">Premium</Badge>}
          {protocol.tag && !protocol.isPremium && (
            <Badge variant="gold">{protocol.tag}</Badge>
          )}
        </div>
      </div>
      <CardHeader className="mb-0 mt-4 flex-1">
        <CardTitle className={compact ? "text-base" : "text-lg"}>
          {protocol.title}
        </CardTitle>
        {!compact && (
          <>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {protocol.description}
            </CardDescription>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-forest">Objetivo: </span>
              {protocol.objective}
            </p>
          </>
        )}
      </CardHeader>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline">{protocol.categoryLabel}</Badge>
        <Badge variant="outline">{protocol.level}</Badge>
        <Badge variant="outline">{protocol.duration}</Badge>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          href={routes.protocolo(protocol.slug)}
          variant={protocol.isPremium ? "gold" : "primary"}
          size="sm"
          className="w-full justify-center sm:w-auto"
        >
          Ver protocolo
        </Button>
        {canFavorite && (
          <FavoriteButton
            contentType="protocol"
            contentId={protocol.id}
            initialFavorited={favorited}
            loginRequired={loginRequired}
          />
        )}
      </div>
      {protocol.isPremium && (
        <p className="mt-2 flex items-center gap-1 text-xs text-muted">
          <Icon name="star" size={14} className="text-gold" />
          Requer assinatura Premium ativa
        </p>
      )}
    </Card>
  );
}
