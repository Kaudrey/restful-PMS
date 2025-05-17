import {Request, Response, NextFunction} from 'express';  
import prisma from '../config/db';
import {z} from 'zod';

export const addParkingSlot = async (req: Request, res: Response, next: NextFunction) => {
try {
    const newSlot = await prisma.parkingSlot.create({
        data: req.body,
    });
    res.status(201).json(newSlot);
    
} catch (err: any) {
    if(err.code === 'P2002'){
        const field = err.meta?.target[0];
        if(field === 'slotNumber'){
            return res.status(409).json({message: `Slot number ${req.body.slotNumber} already exists.Please prvide a unique slot number`});
        }
    }
    next(err);
    
}
}

export const getParkingSlots = async (req: Request, res: Response, next:NextFunction) => {
    try {
        
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 10;

        const slots = await prisma.parkingSlot.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy:{id: 'asc'}
        });

        const total = await prisma.parkingSlot.count();

        res.status(200).json({
            data: slots,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });

    } catch (err) {

        next(err)
        
    }
}

export const getSlotByNumber = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const number = req.params.number;
        const slot = await prisma.parkingSlot.findUnique({
            where: { slotNumber: number } });

        if (!slot) {
            return res.status(404).json({ message: `Slot number ${number} not found` });
        }

        res.status(200).json(slot);

    } catch (err: any) {
        next(err);
        
    }
}

export const updateSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const number = req.params.number;
       const updatedSlot = await prisma.parkingSlot.update({
        where: { slotNumber: number },
        data: req.body,
       });

       res.status(200).json(updatedSlot);
    } catch (err: any) {
        if(err.code === 'P2002'){
            const field = err.meta?.target[0];

            if(field === 'slotNumber'){
                return res.status(409).json({message: `Slot number ${req.body.slotNumber} already exists.Please prvide a unique slot number`});
            }
        next(err);
        
    }

}
}

export const deleteSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const number = req.params.number;
        const existing = await prisma.parkingSlot.findUnique({
            where: { slotNumber: number }})


            if(!existing){
                return res.status(404).json({message: `Slot number ${number} not found`});
            }

            await prisma.parkingSlot.delete({  
                where: { slotNumber: number }
            })
            res.status(200).json({message: `Slot number ${number} deleted successfully`});

    } catch (err: any) {
        next(err);
        
    }
}