import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils";
import type { Member } from "@/lib/mock-data";

interface MemberListProps {
  members: Member[];
  president?: string;
  cabinet?: { address: string; role: string }[];
}

export function MemberList({ members, president, cabinet }: MemberListProps) {
  const cabinetMap = new Map(cabinet?.map((c) => [c.address, c.role]) ?? []);

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const cabinetRole = cabinetMap.get(member.address);
        const isPresident = member.address === president;
        return (
          <div
            key={member.address}
            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10">
                  {member.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-mono">
                  {shortenAddress(member.address)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Staked {member.stakeAmount} USDC
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPresident && (
                <Badge variant="default" className="text-xs">
                  President
                </Badge>
              )}
              {!isPresident && cabinetRole && (
                <Badge variant="secondary" className="text-xs">
                  {cabinetRole}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
