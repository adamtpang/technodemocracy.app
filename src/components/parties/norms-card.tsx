"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, History, ExternalLink } from "lucide-react";
import type { NormsVersion } from "@/lib/mock-data";

interface NormsCardProps {
  versions: NormsVersion[];
  partyName: string;
  partyColor: string;
}

export function NormsCard({ versions, partyName, partyColor }: NormsCardProps) {
  const [selected, setSelected] = useState(versions.length - 1);

  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {partyName} has not published norms yet.
        </CardContent>
      </Card>
    );
  }

  const current = versions[selected];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <ScrollText className="h-5 w-5" style={{ color: partyColor }} />
            Party Norms
          </CardTitle>
          <Badge variant="outline" className="gap-1 text-[10px]" style={{ borderColor: partyColor + "60" }}>
            <History className="h-2.5 w-2.5" />
            v{current.version} of {versions.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Joining {partyName} requires agreement to the current norms version.
          Slashing requires the resolver to cite the exact norm + content hash.
          Versions are immutable.
        </p>
      </CardHeader>
      <CardContent>
        {versions.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
            {versions.map((v, i) => (
              <button
                key={v.version}
                onClick={() => setSelected(i)}
                className={`text-xs rounded px-2 py-1 ${
                  i === selected
                    ? "border-2 font-semibold"
                    : "border bg-muted/30 text-muted-foreground hover:text-foreground"
                }`}
                style={i === selected ? { borderColor: partyColor, color: partyColor } : undefined}
              >
                v{v.version}{" "}
                <span className="text-[10px] text-muted-foreground">
                  ({new Date(v.publishedAt).toLocaleDateString()})
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mb-4 text-xs">
          <div className="rounded border bg-muted/30 p-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">IPFS CID</div>
            <div className="font-mono break-all flex items-center gap-1">
              {current.ipfsCID}
              <a
                href={`https://ipfs.io/ipfs/${current.ipfsCID.replace("ipfs://", "")}`}
                target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <div className="rounded border bg-muted/30 p-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-0.5">Content Hash</div>
            <div className="font-mono text-[10px] break-all">{current.contentHash}</div>
          </div>
        </div>

        <div className="rounded border p-4 bg-muted/10">
          <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-foreground/90">
            {current.body}
          </pre>
        </div>

        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          Published{" "}
          {new Date(current.publishedAt).toLocaleString(undefined, {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </CardContent>
    </Card>
  );
}
