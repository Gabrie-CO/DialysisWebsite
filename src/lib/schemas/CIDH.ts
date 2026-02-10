import { boolean, z } from "zod";

const dosage = ["1g", "0.5", "Other"]
const Via = ["IV", "VO"]
const result = ["Hemocultivo", "Positivo", "Negativo"]
export const CIDHSchema = z.object({


  //Treatments 

  // Checkboxes
  paciente_Lo_Trajo: z.boolean().default(false),
  dosis: z.boolean().default(false),
  hospitalized: z.boolean().default(false),
  finished_Treatmen: z.boolean().default(false),
  left_before_treatment: z.boolean().default(false),
  Continous_fever: z.boolean().default(false),

  //Access

  // Dialysis Params
  time: z.string().default(""),
  qd: z.string().default(""),
  qb: z.string().default(""),
  ktvt: z.string().default(""),
  filter: z.string().default(""),

  observations: z.string().default(""),
  signature: z.string().default(""),
});
export type CIDHSchema = typeof CIDHSchema
