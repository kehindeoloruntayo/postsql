import {z} from 'zod';

const addToWatchlistSchema = z.object({
    movieId: z.string().uuid("movieId must be a valid UUID"),
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
        error: () => ({
            message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED"
        }),
    }).optional(),
    rating: z.coerce
     .number()
     .int("Rating must be an integer")
     .min(1, "Rating must be between 1 and 10")
     .max(10, "Rating must be between 1 and 10")
     .optional(),
    notes: z.string().optional()
});

// const updateWatchlistItemSchema = z.object({
//     status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
//         error: () => ({
//             message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED"
//         }),
//     }).optional(),
//     rating: z.coerce.number().min(1).max(10).optional(),
//     notes: z.string().max(200).optional()
// });

export { addToWatchlistSchema };