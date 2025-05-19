import {Request, Response, NextFunction} from 'express';  
import prisma from '../config/db';
import {AuthRequest} from '../middlewares/auth.middleware';
import PDFDocument from 'pdfkit';

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
  data: { status: 'APPROVED', startTime: new Date() },  
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

export const getPendingRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Only ADMIN should access this
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pendingRequests = await prisma.parkingRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        slot: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(pendingRequests);
  } catch (err) {
    next(err);
  }
};


export const endParkingSession = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;
    const userId = req.user?.id;

    const request = await prisma.parkingRequest.findUnique({
      where: { id: requestId },
      include: { slot: true, user: true },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.userId !== userId) return res.status(403).json({ message: "Unauthorized" });
    if (request.status !== 'APPROVED') return res.status(400).json({ message: "Cannot end a session that is not active" });
    if (!request.startTime) return res.status(400).json({ message: "Start time not set" });

    const endTime = new Date();

    // Calculate total time in minutes
    const totalTime = Math.ceil((endTime.getTime() - request.startTime.getTime()) / (1000 * 60));

    // Rate per minute (customize this)
    const ratePerMinute = 0.05;
    const totalCharge = totalTime * ratePerMinute;

    // Update parkingRequest
    await prisma.parkingRequest.update({
      where: { id: requestId },
      data: {
        endTime,
        totalTime,
        totalCharge,
        status: 'COMPLETED',
      },
    });

    // Free the parking slot
    await prisma.parkingSlot.update({
      where: { id: request.slotId },
      data: { inUse: false },
    });

    // Generate PDF in-memory
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      
      // Send JSON + PDF base64 in the same response
      res.status(200).json({
        message: "Parking session ended",
        ticket: {
          totalTime,
          totalCharge,
          startTime: request.startTime,
          endTime,
          slotNumber: request.slot.slotNumber,
          userName: request.user.name,
          userEmail: request.user.email,
          pdfBase64: pdfData.toString('base64'), // base64 encoded PDF
        },
      });
    });

    // Design your PDF ticket
    doc.fontSize(20).text('Parking Ticket', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`User: ${request.user.name} (${request.user.email})`);
    doc.text(`Slot Number: ${request.slot.slotNumber}`);
    doc.text(`Start Time: ${request.startTime?.toLocaleString()}`);
    doc.text(`End Time: ${endTime.toLocaleString()}`);
    doc.text(`Total Time Parked: ${totalTime} minutes`);
    doc.text(`Total Charge: $${totalCharge.toFixed(2)}`);

    doc.moveDown();
    doc.text('Thank you for using our parking service!', { align: 'center' });

    doc.end();

  } catch (err) {
    next(err);
  }
};



