import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { coachValidationSchema } from 'validationSchema/coaches';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCoaches();
    case 'POST':
      return createCoach();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCoaches() {
    const data = await prisma.coach
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'coach'));
    return res.status(200).json(data);
  }

  async function createCoach() {
    await coachValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.player?.length > 0) {
      const create_player = body.player;
      body.player = {
        create: create_player,
      };
    } else {
      delete body.player;
    }
    if (body?.player_profile?.length > 0) {
      const create_player_profile = body.player_profile;
      body.player_profile = {
        create: create_player_profile,
      };
    } else {
      delete body.player_profile;
    }
    const data = await prisma.coach.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
