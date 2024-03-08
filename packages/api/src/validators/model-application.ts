import { z } from 'zod';


export const CreateModelApplicationExperienceSchema = z.object({
    year: z.string(),
    media: z.string(),
    country: z.string(),
    product: z.string(),
    details: z.string().optional()
})

export const CreateModelApplicationSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    lineId: z.string().optional(),
    weChat: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
    dateOfBirth: z.string().datetime({offset: false}),
    gender: z.string(),
    nationality: z.string(),
    ethnicity: z.string(),
    address: z.string(),
    city: z.string(),
    region: z.string(),
    zipCode: z.string(),
    country: z.string(),
    experiences: z.array(CreateModelApplicationExperienceSchema).optional(),
    talents: z.array(z.string()).optional(),
    aboutMe: z.string().optional(),
    height: z.string(),
    weight: z.string(),
    bust: z.string(),
    hips: z.string(),
    suitDressSize: z.string(),
    shoeSize: z.string(),
    eyeColor: z.string(),
    hairColor: z.string(),
    images: z.array(z.string()).optional(),
    // status: z.string().optional()
});





