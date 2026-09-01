"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserMinus, UsersRound } from "lucide-react";

export function FollowButton({
  userId,
  initialIsFollowing,
  initialIsFriend,
}: {
  userId: string;
  initialIsFollowing: boolean;
  initialIsFriend: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isFriend, setIsFriend] = useState(initialIsFriend);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        if (isFollowing) setIsFriend(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (isFriend) {
    return (
      <Button variant="secondary" size="sm" onClick={toggle} disabled={loading}>
        <UsersRound size={16} /> Arkadaşsınız
      </Button>
    );
  }

  return (
    <Button variant={isFollowing ? "secondary" : "primary"} size="sm" onClick={toggle} disabled={loading}>
      {isFollowing ? (
        <>
          <UserMinus size={16} /> Takibi Bırak
        </>
      ) : (
        <>
          <UserPlus size={16} /> Takip Et
        </>
      )}
    </Button>
  );
}
