import {Request, Response, NextFunction} from 'express';  
import prisma from '../config/db';
import {AuthRequest} from '../middlewares/auth.middleware';

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slots = await prisma.parkingSlot.findMany({
      where: { inUse: false },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(slots);
  } catch (err) {
    next(err);
  }
};

export const requestSlot = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { slotId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const slot = await prisma.parkingSlot.findUnique({ where: { id: slotId } });

    if (!slot || slot.inUse) {
      return res.status(400).json({ message: "Slot not available." });
    }

    const newRequest = await prisma.parkingRequest.create({
      data: {
        slotId,
        userId,
      },
    });

    res.status(201).json(newRequest);
  } catch (err) {
    next(err);
  }
};


export const getUserRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const requests = await prisma.parkingRequest.findMany({
      where: { userId },
      include: { slot: true },
    });

    res.status(200).json(requests);
  } catch (err) {
    next(err);
  }
};

export const getAllRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const allRequests = await prisma.parkingRequest.findMany({
      include: {
        slot: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(200).json(allRequests);
  } catch (err) {
    next(err);
  }
};

export const approveRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;

    const request = await prisma.parkingRequest.findUnique({
      where: { id: requestId },
      include: { slot: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await prisma.parkingRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });

    await prisma.parkingSlot.update({
      where: { id: request.slotId },
      data: { inUse: true },
    });

    res.status(200).json({ message: "Request approved and slot marked as in use" });
  } catch (err) {
    next(err);
  }
};

export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;

    const request = await prisma.parkingRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: "Request is not pending" });
    }

    await prisma.parkingRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });

    res.status(200).json({ message: "Request rejected" });
  } catch (err) {
    next(err);
  }
};



