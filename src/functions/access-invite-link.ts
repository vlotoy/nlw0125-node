import { redis } from '../redis/client'

interface AccessInviteLinkProps {
  subscriberId: string
}

export async function accessInviteLink({
  subscriberId,
}: AccessInviteLinkProps) {
  await redis.hincrby('referral:access-count', subscriberId, 1)
}
