import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Users } from "lucide-react";
import type { CabinetMember } from "@/lib/mock-data";
import { shortenAddress } from "@/lib/utils";

interface CabinetCardProps {
  president: string;
  cabinet: CabinetMember[];
  partyColor: string;
}

export function CabinetCard({ president, cabinet, partyColor }: CabinetCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cabinet
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          The president names a cabinet via digital delegation. Each member
          holds cryptographically scoped powers — never more than what is shown.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border-2 p-3" style={{ borderColor: partyColor + "60" }}>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-xs" style={{ backgroundColor: partyColor + "20", color: partyColor }}>
                {president.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm">{shortenAddress(president)}</span>
                <Badge className="text-[10px] gap-1" style={{ backgroundColor: partyColor, color: "white" }}>
                  <Crown className="h-2.5 w-2.5" />
                  President
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Holds full franchise scope from each member.
              </p>
            </div>
          </div>
        </div>

        {cabinet.map((member) => (
          <div key={member.address} className="rounded-lg border p-3">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="text-xs bg-muted">
                  {member.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm">{shortenAddress(member.address)}</span>
                  <Badge variant="secondary" className="text-[10px]">{member.role}</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-1 mt-2 pl-12">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Scoped Powers</p>
              {member.powers.map((power, i) => (
                <p key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                  <span className="h-1 w-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: partyColor }} />
                  {power}
                </p>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
